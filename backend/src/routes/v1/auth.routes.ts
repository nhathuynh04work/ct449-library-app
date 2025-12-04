import { loginDocGia, loginNhanVien } from "@/controllers/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
	DocGiaLoginSchema,
	NhanVienLoginSchema,
} from "@/schemas/auth.schema.js";
import { Router } from "express";

const router = Router();

router.post("/docgia-login", validate(DocGiaLoginSchema), loginDocGia);
router.post("/nhanvien-login", validate(NhanVienLoginSchema), loginNhanVien);

export default router;
