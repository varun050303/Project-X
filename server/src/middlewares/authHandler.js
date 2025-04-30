import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import logger from "../utils/logging/logger.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const authCookieName = process.env.AUTH_COOKIE_NAME || 'authToken';

/**
 * Authentication middleware to verify JWT tokens
 * Attaches the user object to the request if authentication is successful
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    let token = req.cookies[authCookieName];
    
    // If not in cookies, check authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new ApiError(401, "Authentication required. Please login.");
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      
      // Check if token is about to expire (within 5 minutes)
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutesInMs = 5 * 60 * 1000;
      
      if (expirationTime - currentTime < fiveMinutesInMs) {
        // Token is about to expire, set a header to trigger refresh
        res.setHeader('X-Token-Expiring', 'true');
      }
      
      // Add user information to request object
      req.user = decoded;
      
      // Optionally verify that the user still exists in the database
      if (process.env.VERIFY_USER_EXISTS === 'true') {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { 
            id: true, 
            status: true,
            role: true
          }
        });
        
        if (!user) {
          throw new ApiError(401, "User no longer exists.");
        }
        
        if (user.status !== 'ACTIVE') {
          throw new ApiError(403, "Account is inactive or suspended.");
        }
        
        // Update the user info with latest data from database
        req.user.role = user.role;
        req.user.status = user.status;
      }
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, "Invalid authentication token.");
      } else if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, "Authentication token expired. Please login again.");
      } else {
        // Pass through custom errors (like ApiError)
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware to check user roles
 * @param {Array} roles - Array of allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required before authorization.");
      }
      
      if (!roles.includes(req.user.role)) {
        logger.warn({
          message: `Authorization failure: User ${req.user.id} with role ${req.user.role} attempted to access a resource requiring roles: ${roles.join(', ')}`,
          data: {
            userId: req.user.id,
            requiredRoles: roles,
            actualRole: req.user.role,
            path: req.path,
            method: req.method,
            ip: req.ip
          }
        });
        
        throw new ApiError(403, "You don't have permission to access this resource.");
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require authentication
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = req.cookies[authCookieName];
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      // No token, but that's ok - continue as unauthenticated
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.user = decoded;
    } catch (error) {
      // Invalid token, but that's ok for this middleware
      // Just continue as unauthenticated
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
