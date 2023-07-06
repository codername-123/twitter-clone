import express from "express";
import validateSchema from "../middleware/validateSchema.middleware.js";
import {
  followUserHandler,
  unfollowUserHandler,
} from "../controller/follow.controller.js";
import {
  followUserSchema,
  unfollowUserSchema,
} from "../schema/follow.schema.js";

const router = express.Router();

/**
 * route: /api/follow
 */
router.post("/follow", validateSchema(followUserSchema), followUserHandler);

/**
 * route: /api/unfollow
 */
router.post(
  "/unfollow",
  validateSchema(unfollowUserSchema),
  unfollowUserHandler
);

export default router;
