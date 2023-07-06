import { StatusCodes } from "http-status-codes";

export default {
  USER_DOES_NOT_EXIST_ERROR: {
    message: "Requested user does not exist",
    status: StatusCodes.NOT_FOUND,
  },
  UNABLE_TO_FIND_USER_TO_FOLLOW_ERROR: {
    message: "User you are trying to follow does not exist",
    status: StatusCodes.NOT_FOUND,
  },
  UNABLE_TO_FIND_USER_TO_UNFOLLOW_ERROR: {
    message: "User you are trying to unfollow does not exist",
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
  // Below are dynamic errors whose messages are generated through function
  ALREADY_FOLLOWS_ERROR: {
    message: (username, targetUsername) =>
      `${username} already follows ${targetUsername}`,
    status: StatusCodes.CONFLICT,
  },
  DOES_NOT_FOLLOW_ERROR: {
    message: (username, targetUsername) =>
      `${username} doesn't follow ${targetUsername}`,
    status: StatusCodes.CONFLICT,
  },
};
