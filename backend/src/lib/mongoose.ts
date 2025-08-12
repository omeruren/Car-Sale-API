/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import mongoose from "mongoose";

/**
 * Custom Modules
 */
import config from "@/config";
import { logger } from "@/lib/winston";

/**
 * Types
 */
import type { ConnectOptions } from "mongoose";
import { warn } from "console";

/**
 * Client option
 */
const clientOptions: ConnectOptions = {
  dbName: 'car-sale',
  appName: 'Car Sale App',
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {

    if (!config.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables.");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
   
    logger.info("Connected to MongoDB successfully.", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    logger.error("Failed to connect to MongoDB:", error);
  }
};


export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB successfully.",{
        uri: config.MONGO_URI,
        options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) throw error;
   logger.error("Failed to disconnect from MongoDB:", error);
  }
};