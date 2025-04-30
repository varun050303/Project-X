import express from "express";
import userRoutes from "./routes/user.routes.js";
import workerRoutes from "./routes/worker.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import bidRoutes from "./routes/bid.routes.js";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
import cluster from "cluster";
import os from "os";

// Import custom middleware
import { applySecurityMiddleware } from "./middlewares/security.js";
import errorHandler, { notFoundHandler } from "./middlewares/errorHandler.js";
import { requestIdMiddleware, httpLogger } from "./utils/logging/httpLogger.js";
import logger from "./utils/logging/logger.js";

// Initialize Prisma client
const prisma = new PrismaClient();

// Check if critical environment variables are set
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'CLIENT_ROOT',
  'ACCESS_SECRET',
  'REFRESH_SECRET',
  'DB_URI'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Determine if we should use clustering in production
const enableClustering = process.env.ENABLE_CLUSTERING === 'true' && 
  process.env.NODE_ENV === 'production' && 
  cluster.isPrimary;

// If clustering is enabled and this is the primary process
if (enableClustering) {
  const numCPUs = os.cpus().length;
  
  logger.info(`Primary process ${process.pid} is running`);
  logger.info(`Starting ${numCPUs} worker processes...`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    logger.info('Starting a new worker...');
    cluster.fork();
  });
} else {
  // This is either a worker process or we're not using clustering
  
  // Create Express app
  export const app = express();
  const port = process.env.PORT || 3000;
  
  // Add request ID to each request
  app.use(requestIdMiddleware);
  
  // HTTP request logging
  app.use(httpLogger);
  
  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  
  // Apply security middleware (CORS, helmet, rate limiting, etc.)
  applySecurityMiddleware(app);
  
  // Compress responses
  app.use(compression());
  
  // Health check endpoint
  app.get('/health', async (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: 'UP',
    };
    
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      healthcheck.database = 'UP';
      
      res.json(healthcheck);
    } catch (error) {
      healthcheck.database = 'DOWN';
      healthcheck.error = error.message;
      
      logger.error('Health check failed', { error });
      res.status(503).json(healthcheck);
    }
  });
  
  // Register API routes
  app.use("/api/users", userRoutes);
  app.use("/api/workers", workerRoutes);
  app.use("/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/bids", bidRoutes);
  
  // Basic test endpoint
  app.get("/ok", (_, res) => {
    res.send("Server is running");
  });
  
  // Handle 404 errors for undefined routes
  app.use(notFoundHandler);
  
  // Global error handler - must be last
  app.use(errorHandler);
  
  // Start the server
  const server = app.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  });
  
  // Handle graceful shutdown
  const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Close the server first, to stop accepting new connections
    server.close(async () => {
      try {
        // Close database connections
        await prisma.$disconnect();
        logger.info('Database connections closed.');
        
        logger.info('Graceful shutdown completed.');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', { error });
        process.exit(1);
      }
    });
    
    // If server doesn't close within 10 seconds, force exit
    setTimeout(() => {
      logger.error('Graceful shutdown timed out, forcing exit.');
      process.exit(1);
    }, 10000);
  };
  
  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught exceptions and unhandled promise rejections
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error });
    // Don't exit in development to make debugging easier
    if (process.env.NODE_ENV === 'production') {
      gracefulShutdown('uncaughtException');
    }
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection:', { reason });
    // Don't exit in development to make debugging easier
    if (process.env.NODE_ENV === 'production') {
      gracefulShutdown('unhandledRejection');
    }
  });
}
