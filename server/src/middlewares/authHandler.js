import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new ApiError(401, 'Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        throw new ApiError(400, 'Invalid token.');
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'Access denied.');
        }
        next();
    };
};