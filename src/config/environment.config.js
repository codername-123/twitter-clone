import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  host: process.env.HOST,
  databaseName: process.env.DATABASE_NAME,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
};

export default environment;
