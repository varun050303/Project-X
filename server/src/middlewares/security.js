import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * Configure and return helmet middleware with enhanced security headers
 */
export const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://*.cloudinary.com'],
        connectSrc: ["'self'", process.env.CLIENT_ROOT || '*'],
      },
    },
    crossOriginEmbedderPolicy: false, // Set to true in production if possible
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: {
      maxAge: 15552000, // 180 days
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    noSniff: true,
  });
};

/**
 * Configure CORS options based on environment
 */
export const configureCors = () => {
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_ROOT, 
        // Add more origins as needed
      ];
      
      // In development, allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400, // 1 day in seconds
  };
  
  return cors(corsOptions);
};

/**
 * General rate limiter for all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skipSuccessfulRequests: false,
});

/**
 * More strict rate limiter for authentication routes
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again after an hour',
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
});

/**
 * Configure secure cookie options based on environment
 */
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
};

/**
 * Apply all security middleware to an Express app
 */
export const applySecurityMiddleware = (app) => {
  // Basic security headers
  app.use(configureHelmet());
  
  // CORS protection
  app.use(configureCors());
  
  // Parse cookies
  app.use(cookieParser());
  
  // Rate limiting
  app.use('/api/', apiLimiter);
  app.use('/auth/', authLimiter);
  
  // Protection against XSS attacks
  app.use(xss());
  
  // Protection against NoSQL injection
  app.use(mongoSanitize());
  
  // Protection against HTTP Parameter Pollution
  app.use(hpp());
  
  // Set security headers for all responses
  app.use((_, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    next();
  });
  
  return app;
};
