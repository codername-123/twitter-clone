import mongoose from "mongoose";
import environment from "../config/environment.js";
import logger from "./winston.js";

export async function connectMongo() {
  try {
    await mongoose.connect(environment.databaseUri, {
      dbName: environment.databaseName,
    });
    logger.info("Connected to Database");
  } catch (error) {
    logger.error("Unable to connect to Database");
    logger.debug(error);
    process.exit(1);
  }
}

export async function disconnectMongo() {
  await mongoose.connection.close();
  logger.info("Disconnect from Database");
}
