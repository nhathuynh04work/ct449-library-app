import type { Request, Response } from "express";
import * as danhMucService from "../services/danhMuc.service.js";
import type { CreateDanhMucPayload } from "@/schemas/danhMuc/create.schema.js";
import type { UpdateDanhMucPayload } from "@/schemas/danhMuc/update.schema.js";

export async function getAllDanhMuc(req: Request, res: Response) {
    const listDanhMuc = await danhMucService.getAllDanhMuc();

    res.status(200).json({
        message: "Lấy danh sách danh mục thành công.",
        listDanhMuc: listDanhMuc,
    });
}

export async function createDanhMuc(req: Request, res: Response) {
	const payload = req.body as CreateDanhMucPayload;

	const newDanhMuc = await danhMucService.createDanhMuc(payload);
	res.status(201).json({
		message: "Tạo danh mục mới thành công.",
		danhMuc: newDanhMuc,
	});
}

export async function updateDanhMuc(req: Request, res: Response) {
	const { maDanhMuc } = req.params as { maDanhMuc: string };
	const payload = req.body as UpdateDanhMucPayload;

	const updatedDanhMuc = await danhMucService.updateDanhMuc(
		maDanhMuc,
		payload
	);

	res.status(200).json({
		message: "Cập nhật danh mục thành công.",
		danhMuc: updatedDanhMuc,
	});
}

export async function deleteDanhMuc(req: Request, res: Response) {
	const { maDanhMuc } = req.params as { maDanhMuc: string };

	await danhMucService.deleteDanhMuc(maDanhMuc);

	res.status(200).json({
		message: "Xóa danh mục thành công.",
	});
}
