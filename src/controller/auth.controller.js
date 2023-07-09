import { StatusCodes } from "http-status-codes";
import lodash from "lodash";
import * as AuthService from "../services/auth.service.js";

export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.loginUser(
      email,
      password
    );
    res.cookie("kt_access", accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true, // only accessible by web browsers
      sameSite: "None",
      // secure: "true" // make true on production
    });
    res.cookie("kt_refresh", refreshToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true, // only accessible by web browsers
      sameSite: "None",
      // secure: "true" // make true on production
    });
    res.status(StatusCodes.OK).json({ data: {}, message: "" });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

export async function logoutHandler(req, res) {
  try {
    await AuthService.logoutUser(req.user.session);
    res.clearCookie("kt_access", {
      maxAge: 1000 * 60 * 15,
      httpOnly: true, // only accessible by web browsers
      sameSite: "None",
      // secure: "true" // make true on production
    });
    res.clearCookie("kt_refresh", {
      maxAge: 1000 * 60 * 15,
      httpOnly: true, // only accessible by web browsers
      sameSite: "None",
      // secure: "true" // make true on production
    });
    res.status(StatusCodes.OK).json({ data: {}, message: "" });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

export async function refreshTokenHandler(req, res) {
  try {
    const refreshToken = lodash.get(req, "cookies.kt_refresh", "");
    const accessToken = await AuthService.refreshAccessToken(refreshToken);

    res.cookie("kt_access", accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true, // only accessible by web browsers
      sameSite: "None",
      // secure: "true" // make true on production
    });

    res.status(StatusCodes.OK).json({ data: {}, message: "" });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

export function getCurrentAuthenticatedUserHandler(req, res) {
  return res.status(StatusCodes.OK).json({ data: req.user, message: "" });
}
