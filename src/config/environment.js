import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  host: process.env.HOST,
  databaseName: process.env.DATABASE_NAME,
};

export default environment;
