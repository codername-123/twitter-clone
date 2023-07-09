import lodash from "lodash";
import { verifyJwt } from "../utils/jwt.js";

export default function deserializeUser(req, res, next) {
  const accessToken =
    lodash.get(req, "cookies.kt_access", "") ||
    lodash.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }
  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
  if (decoded) {
    req.user = decoded;
  }
  return next();
}
