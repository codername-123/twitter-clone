import { StatusCodes } from "http-status-codes";
import * as UserService from "../services/user.service.js";
import lodash from "lodash";
import { privateFields } from "../model/user.model.js";

export async function createUserHandler(req, res) {
  try {
    const body = req.body;
    const user = await UserService.create(body);
    const response = lodash.omit(user.toJSON(), privateFields);
    return res.status(StatusCodes.CREATED).json({ user: response });
  } catch (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
}

export async function findByUsernameHandler(req, res) {
  const { username } = req.params;
  try {
    const user = await UserService.findByUsername(username);
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
}
