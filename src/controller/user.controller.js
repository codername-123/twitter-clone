import { createUser } from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import lodash from "lodash";
import logger from "../utils/winston.js";
import { privateFields } from "../model/user.model.js";

export async function createUserHandler(req, res) {
  try {
    const body = req.body;
    const user = await createUser(body);
    return res
      .status(StatusCodes.CREATED)
      .json(lodash.omit(user.toJSON(), privateFields));
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
