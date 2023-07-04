import express from "express";
import { createUserHandler } from "../controller/user.controller.js";
import validateSchema from "../middleware/validateSchema.middleware.js";
import { createUserSchema } from "../schema/user.schema.js";

const router = express.Router();

router.post("/users", validateSchema(createUserSchema), createUserHandler);

export default router;
