import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { CreateUserSchema } from "@/schemas/auth.schema.js";

const router = Router();

router.post("/register", validate(CreateUserSchema), authController.register);

export default router;
