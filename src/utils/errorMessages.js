import { StatusCodes } from "http-status-codes";

export default {
  USER_DOES_NOT_EXIST_ERROR: {
    message: "Requested user does not exist",
    status: StatusCodes.NOT_FOUND,
  },
  UNAUTHORIZED_ERROR: {
    message: "This action is not allowed",
    staus: StatusCodes.FORBIDDEN,
  },
  TWEET_NOT_FOUND_ERROR: {
    message: "Requested tweet was not found",
    status: StatusCodes.NOT_FOUND,
  },
  SOMETHING_WENT_WRONG_ERROR: {
    message: "Something went wrong while handling your request",
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  DUPLICATE_USER_ERROR: {
    message: "User already exits",
    status: StatusCodes.UNPROCESSABLE_ENTITY,
  },
  NOT_AUTHENTICATED: {
    message: "Authenticated user is required",
    status: StatusCodes.UNAUTHORIZED,
  },
};
