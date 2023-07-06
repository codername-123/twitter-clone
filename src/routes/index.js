import express from "express";
import user from "./user.routes.js";
import follow from "./follow.routes.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/healthcheck", (_, res) => {
  res.status(StatusCodes.OK).json({ data: "API is live" });
});

router.use(user);
router.use(follow);

export default router;
