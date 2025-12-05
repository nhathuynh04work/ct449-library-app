import {
	registerNhanVien,
	getAllNhanVien,
} from "@/controllers/nhanVien.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { RegisterNhanVienSchema } from "@/schemas/nhanVien.schema.js";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, getAllNhanVien);
router.post(
	"/",
	authenticate,
	validate(RegisterNhanVienSchema),
	registerNhanVien
);

export default router;
