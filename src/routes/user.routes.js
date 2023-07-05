import express from "express";
import validateSchema from "../middleware/validateSchema.middleware.js";
import {
  createUserHandler,
  findByUsernameHandler,
} from "../controller/user.controller.js";

import {
  createUserSchema,
  getByUsernameSchema,
} from "../schema/user.schema.js";

const router = express.Router();

/**
 * route: /api/users
 */
router.post("/users", validateSchema(createUserSchema), createUserHandler);

/**
 * route: /api/users/:username
 */
router.get(
  "/users/:username",
  validateSchema(getByUsernameSchema),
  findByUsernameHandler
);

export default router;
