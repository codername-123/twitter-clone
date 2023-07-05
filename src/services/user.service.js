import lodash from "lodash";
import UserModel, { privateFields } from "../model/user.model.js";
import WebError from "../errors/web.error.js";
import errorMessages from "../utils/errorMessages.js";

const {
  DUPLICATE_USER_ERROR,
  SOMETHING_WENT_WRONG_ERROR,
  USER_DOES_NOT_EXIST_ERROR,
} = errorMessages;

export async function create(input) {
  try {
    const user = await UserModel.create(input);
    return user;
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      throw new WebError(
        DUPLICATE_USER_ERROR.status,
        DUPLICATE_USER_ERROR.message
      );
    }
    throw new WebError(
      SOMETHING_WENT_WRONG_ERROR.status,
      SOMETHING_WENT_WRONG_ERROR.message
    );
  }
}

export async function findByUsername(username) {
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      throw new WebError(
        USER_DOES_NOT_EXIST_ERROR.status,
        USER_DOES_NOT_EXIST_ERROR.message
      );
    }
    return lodash.omit(user.toJSON(), privateFields);
  } catch (error) {
    if (error instanceof WebError) {
      throw error;
    }
    throw new WebError(
      SOMETHING_WENT_WRONG_ERROR.status,
      SOMETHING_WENT_WRONG_ERROR.message
    );
  }
}
