import { registerNhanVien } from "@/controllers/nhanVien.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { CreateNhanVienSchema } from "@/schemas/nhanVien.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", validate(CreateNhanVienSchema), registerNhanVien);

export default router;
