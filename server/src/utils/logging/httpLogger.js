import morgan from 'morgan';
import logger from './logger.js';
import { v4 as uuidv4 } from 'uuid';

// Create a stream for morgan to log to our winston logger
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Custom token for request ID
morgan.token('id', (req) => req.id);

// Custom token for request body
morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    // Don't log sensitive information like passwords
    const body = { ...req.body };
    
    if (body.password) body.password = '[REDACTED]';
    if (body.token) body.token = '[REDACTED]';
    if (body.accessToken) body.accessToken = '[REDACTED]';
    if (body.refreshToken) body.refreshToken = '[REDACTED]';
    
    return JSON.stringify(body);
  }
  return '';
});

// Custom token for response time
morgan.token('response-time', (req, res, digits) => {
  if (!req._startAt || !res._startAt) {
    return '';
  }
  
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
            (res._startAt[1] - req._startAt[1]) * 1e-6;
  
  return ms.toFixed(digits || 0);
});

// Middleware to assign unique ID to each request
export const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Define the format string
const morganFormat = process.env.NODE_ENV === 'production' 
  ? '[:id] :method :url :status :response-time ms' 
  : '[:id] :method :url :status :response-time ms :body';

// Create the middleware
export const httpLogger = morgan(morganFormat, { stream });
