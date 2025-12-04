import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import logger from "@/utils/logger.js";

export async function loginDocGia(req: Request, res: Response) {
	const { token, user } = await authService.loginDocGia(req.body);

	logger.info(`Độc giả đăng nhập thành công: MSDG ${user.maDocGia}`);

	res.status(201).json({ token, user });
}

export async function loginNhanVien(req: Request, res: Response) {
	const { token, user } = await authService.loginNhanVien(req.body);

	logger.info(`Nhân viên đăng nhập thành công: MSNV ${user.maNhanVien}`);

	res.status(201).json({ token, user });
}
