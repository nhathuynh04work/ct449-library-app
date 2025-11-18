import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { CreateNhanVienSchema } from "@/schemas/auth/register.schema.js";

const router = Router();

router.post(
	"/register",
	validate(CreateNhanVienSchema),
	authController.registerNhanVien
);

export default router;
