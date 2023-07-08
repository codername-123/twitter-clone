import UserModel from "../model/user.model.js";
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
    return user;
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

export async function findByEmail(email) {
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new WebError(
        USER_DOES_NOT_EXIST_ERROR.status,
        USER_DOES_NOT_EXIST_ERROR.message
      );
    }
    return user;
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
// Todo:
// deleting a user is very complex because you have to delete all of its tweets | like(decrease like for the post which was liked) | reply |
// decrement the follower count of the people user followed and decrement following count of the people who followed the user.
// delete all the images linked to the user
