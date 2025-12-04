import { registerNhanVien } from "@/controllers/nhanVien.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { RegisterNhanVienSchema } from "@/schemas/nhanVien/register.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", validate(RegisterNhanVienSchema), registerNhanVien);

export default router;
