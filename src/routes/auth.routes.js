import express from "express";
import validateSchema from "../middleware/validateSchema.middleware.js";
import requireUser from "../middleware/requireUser.js";
import { loginSchema } from "../schema/auth.schema.js";
import {
  loginHandler,
  logoutHandler,
  getCurrentAuthenticatedUserHandler,
  refreshTokenHandler,
} from "../controller/auth.controller.js";

const router = express.Router();

/**
 * route: /api/auth/login
 */
router.post("/auth/login", validateSchema(loginSchema), loginHandler);

/**
 * route: /api/auth/logout
 */
router.post("/auth/logout", requireUser, logoutHandler);

/**
 * route: /api/auth/refresh
 */
router.post("/auth/refresh", refreshTokenHandler);

/**
 * route: /api/auth/me
 */
router.get("/auth/me", requireUser, getCurrentAuthenticatedUserHandler);

export default router;
