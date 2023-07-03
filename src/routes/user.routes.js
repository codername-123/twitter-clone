import express from "express";
import { createUserHandler } from "../controller/user.controller.js";

const router = express.Router();

router.post("/users", createUserHandler);

export default router;
