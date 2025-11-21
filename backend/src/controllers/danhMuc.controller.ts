import type { Request, Response } from "express";
import * as danhMucService from "../services/danhMuc.service.js";
import type { CreateDanhMucPayload } from "@/schemas/danhMuc/create.schema.js";

export async function createDanhMuc(req: Request, res: Response) {
	const payload = req.body as CreateDanhMucPayload;

	const newDanhMuc = await danhMucService.createDanhMuc(payload);
	res.status(201).json({
		message: "Tạo danh mục mới thành công.",
		danhMuc: newDanhMuc,
	});
}
