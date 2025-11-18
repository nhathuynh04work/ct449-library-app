import { Router } from "express";
import nhanVienRoutes from "./nhanVien.routes.js";
import docGiaRoutes from "./docGia.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/nhanvien", nhanVienRoutes);
router.use("/docgia", docGiaRoutes);
router.use("/auth", authRoutes);

export default router;
