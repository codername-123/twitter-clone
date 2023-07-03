import express from "express";
import user from "./user.routes.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/healthcheck", (_, res) => {
  res.status(StatusCodes.OK).json({ data: "API is live" });
});

router.use(user);

export default router;
