import { StatusCodes } from "http-status-codes";

export default function requireUser(req, res, next) {
  if (!req.user) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ data: {}, message: "Not Authorized" });
  }
  return next();
}
