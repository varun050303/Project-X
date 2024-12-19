import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
const authCookieName = process.env.AUTH_COOKIE_NAME;
export const authenticate = (req, _, next) => {
  const token = req.cookies[authCookieName];

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new ApiError(400, "Invalid token.");
  }
};

export const authorize = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied.");
    }
    next();
  };
};
