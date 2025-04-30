import { createLogger, format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Create custom Winston logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'project-x-api' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, requestId, method, path, ...meta }) => {
          const requestInfo = requestId ? `[${requestId}] ${method} ${path}` : '';
          const metaInfo = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} ${level}: ${message} ${requestInfo} ${metaInfo}`;
        })
      )
    }),
    // Add file transport for production logs (error level only)
    ...(process.env.NODE_ENV === 'production' ? [
      new transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
      new transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      })
    ] : [])
  ]
});

// Request logger middleware
export function requestLogger(req, res, next) {
  // Generate unique request ID
  req.id = uuidv4();
  
  // Log request start
  logger.info(`Request started`, {
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Calculate response time
  const start = Date.now();
  
  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const logMethod = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logMethod](`Request completed in ${duration}ms`, {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
}

export { logger };
