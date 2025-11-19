import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import logger from "@/utils/logger.js";

export async function loginDocGia(req: Request, res: Response) {
	const docGia = await authService.loginDocGia(req.body);

	logger.info(`Độc giả đăng nhập thành công: MSDG ${docGia.MSDG}`);

	res.status(200).json({
		message: "Đăng nhập độc giả thành công.",
		user: docGia,
	});
}

export async function loginNhanVien(req: Request, res: Response) {
	const nhanVien = await authService.loginNhanVien(req.body);

	logger.info(`Nhân viên đăng nhập thành công: MSNV ${nhanVien.MSNV}`);

	res.status(200).json({
		message: "Đăng nhập nhân viên thành công.",
		user: nhanVien,
	});
}
