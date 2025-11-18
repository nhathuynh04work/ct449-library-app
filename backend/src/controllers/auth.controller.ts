import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function registerNhanVien(req: Request, res: Response) {
	const newNhanVien = await authService.registerNhanVien(req.body);
	res.status(201).json({ nhanVien: newNhanVien });
}
