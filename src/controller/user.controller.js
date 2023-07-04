import { createUser } from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/winston.js";

export async function createUserHandler(req, res) {
  try {
    const body = req.body;
    const user = await createUser(body);
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    logger.debug(error);
    if (error.code === 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exists" });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
}
