import type { Request, Response } from "express";
import * as docGiaService from "../services/docGia.service.js";

export async function registerDocGia(req: Request, res: Response) {
	const newDocGia = await docGiaService.registerDocGia(req.body);

	const { Password, ...rest } = newDocGia;
	res.status(201).json({
		message: "Đăng ký tài khoản độc giả thành công.",
		docGia: rest,
	});
}
