import type { Request, Response } from "express";
import * as nhanVienService from "@/services/nhanVien.service.js";

export async function registerNhanVien(req: Request, res: Response) {
	const nhanVien = await nhanVienService.registerNhanVien(req.body);

	res.status(201).json(nhanVien);
}
