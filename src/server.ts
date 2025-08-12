/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

/**
 * Custom Modules
 */
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import {logger} from "@/lib/winston";

/**
 * Routes
 */
import v1Routes from "@/routes/v1";

/**
 * Types
 */
import type { CorsOptions } from "cors";

/**
 * Express App
 */

const app = express();

// CORS Configuration

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);

     logger.error(`CORS error: Origin ${origin} not allowed`);
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(cookieParser()); // Parse cookies

app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  })
); // Compress response bodies

app.use(helmet()); // Set security-related HTTP headers

app.use(limiter); // Apply rate limiting

(async () => {
  try {
    await connectToDatabase(); // Connect to MongoDB
    app.use("/api/v1", v1Routes); // Register API routes
    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
   logger.error(`Error starting server: ${error}`);
    if(config.NODE_ENV === 'production'){
      process.exit(1); // Exit the process in production on error
    }
  }
})();

const handleServerShutdown = async () =>{
  try {
    await disconnectFromDatabase(); // Disconnect from MongoDB
    logger.warn("Server is shutting down ");
    process.exit(0); // Exit the process gracefully
  } catch (error) {
   logger.error(`Error during server shutdown: ${error}`);
  }
}

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
