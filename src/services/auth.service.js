import { signJwt, verifyJwt } from "../utils/jwt.js";
import * as UserService from "../services/user.service.js";
import WebError from "../errors/web.error.js";
import errorMessages from "../utils/errorMessages.js";
import lodash from "lodash";
import { privateFields } from "../model/user.model.js";
import SessionModel from "../model/session.model.js";

const {
  INVALID_SESSION_ERROR,
  INVALID_CREDENTIALS_ERROR,
  COULD_NOT_REFRESH_TOKEN_ERROR,
  SOMETHING_WENT_WRONG_ERROR,
} = errorMessages;

export async function createSession(userId) {
  return SessionModel.create({ userId: userId });
}

export async function findSessionById(id) {
  return SessionModel.findById(id);
}

export async function updateSession(query, update) {
  return SessionModel.updateOne(query, update);
}

export function signAccessToken(payload) {
  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });
  return accessToken;
}

export function signRefreshToken(sessionId) {
  const refreshToken = signJwt(
    { session: sessionId },
    "refreshTokenPrivateKey",
    {
      expiresIn: "1d",
    }
  );
  return refreshToken;
}

export async function loginUser(email, password) {
  try {
    const user = await UserService.findByEmail(email);
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new WebError(
        INVALID_CREDENTIALS_ERROR.status,
        INVALID_CREDENTIALS_ERROR.message
      );
    }

    const session = await createSession(user._id);

    const payload = lodash.omit(user.toJSON(), privateFields);
    const accessToken = signAccessToken({ ...payload, session: session._id });
    const refreshToken = signRefreshToken(session._id);
    return { accessToken, refreshToken };
  } catch (error) {
    // You can just throw error as every error will be instance of WebError
    throw error;
  }
}

export async function logoutUser(sessionId) {
  try {
    const session = await findSessionById(sessionId);
    if (!session || !session.valid) {
      throw new WebError(
        INVALID_SESSION_ERROR.status,
        INVALID_SESSION_ERROR.message
      );
    }
    await updateSession({ _id: sessionId }, { valid: false });
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

export async function refreshAccessToken(refreshToken) {
  try {
    const decoded = verifyJwt(refreshToken, "refreshTokenPublicKey");
    if (!decoded) {
      throw new WebError(
        COULD_NOT_REFRESH_TOKEN_ERROR.status,
        COULD_NOT_REFRESH_TOKEN_ERROR.message
      );
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
      throw new WebError(
        COULD_NOT_REFRESH_TOKEN_ERROR.status,
        COULD_NOT_REFRESH_TOKEN_ERROR.message
      );
    }

    const user = await UserService.findUserById(session.userId);

    const payload = lodash.omit(user.toJSON(), privateFields);
    const accessToken = signAccessToken({ ...payload, session: session._id });
    return accessToken;
  } catch (error) {
    throw error;
  }
}
