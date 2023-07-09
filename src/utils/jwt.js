import jwt from "jsonwebtoken";
import environment from "../config/environment.config.js";
import logger from "../utils/winston.js";

export function signJwt(payload, privateKey, options) {
  const signingKey = Buffer.from(environment[privateKey], "base64").toString(
    "ascii"
  );

  const token = jwt.sign(payload, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });

  return token;
}

export function verifyJwt(token, publicKey) {
  const verifyingKey = Buffer.from(environment[publicKey], "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, verifyingKey);
    return decoded;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
}
