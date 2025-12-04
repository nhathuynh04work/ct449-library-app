import { Router } from "express";
import nhanVienRoutes from "./nhanVien.routes.js";
import docGiaRoutes from "./docGia.routes.js";
import danhMucRoutes from "./danhMuc.routes.js";
import tacGiaRoutes from "./tacGia.routes.js";
import nhaXuatBanRoutes from "./nhaXuatBan.routes.js";
import sachRoutes from "./sach.routes.js";
import banSaoRoutes from "./banSao.routes.js";
import muonTraRoutes from "./muonTra.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/nhanvien", nhanVienRoutes);
router.use("/docgia", docGiaRoutes);
router.use("/danhmuc", danhMucRoutes);
router.use("/tacgia", tacGiaRoutes);
router.use("/nhaxuatban", nhaXuatBanRoutes);
router.use("/sach", sachRoutes);
router.use("/bansao", banSaoRoutes);
router.use("/muonTra", muonTraRoutes);
router.use("/auth", authRoutes);

export default router;
