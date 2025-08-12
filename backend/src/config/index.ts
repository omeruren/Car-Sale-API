/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  WHITELIST_ORIGINS: process.env.NODE_ENV === "development" 
    ? ["http://localhost:3001", "http://localhost:3008", "http://localhost:3007", "http://localhost:3006", "http://localhost:3005"]
    : ["omeruren.com"],
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/car-sale",
  JWT_SECRET: process.env.JWT_SECRET || "development-jwt-secret-key",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export default config;
