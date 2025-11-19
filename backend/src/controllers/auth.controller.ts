import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import logger from "@/utils/logger.js";

export async function loginDocGia(req: Request, res: Response) {
	const { token, MSDG } = await authService.loginDocGia(req.body);

	logger.info(`Độc giả đăng nhập thành công: MSDG ${MSDG}`);

	res.status(201).json({
		message: "Đăng nhập độc giả thành công.",
		token: token,
	});
}

export async function loginNhanVien(req: Request, res: Response) {
	const { token, MSNV } = await authService.loginNhanVien(req.body);

	logger.info(`Nhân viên đăng nhập thành công: MSNV ${MSNV}`);

	res.status(201).json({
		message: "Đăng nhập nhân viên thành công.",
		token: token,
	});
}
