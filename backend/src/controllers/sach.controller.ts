import type { Request, Response } from "express";
import * as sachService from "@/services/sach.service.js";
import type { CreateSachPayload } from "@/schemas/sach/create.schema.js";
import type { UpdateSachPayload } from "@/schemas/sach/update.schema.js";

export async function createSach(req: Request, res: Response) {
	const payload = req.body as CreateSachPayload;
	const newSach = await sachService.createSach(payload);

	res.status(201).json({
		message: "Tạo sách thành công.",
		sach: newSach,
	});
}

export async function getAllSach(req: Request, res: Response) {
	const listSach = await sachService.getAllSach();

	res.status(200).json({
		message: "Lấy danh sách sách thành công.",
		data: listSach,
	});
}

export async function getSachByMa(req: Request, res: Response) {
	const { maSach } = req.params as { maSach: string };
	const sach = await sachService.getSachByMa(maSach);

	res.status(200).json({
		message: "Lấy thông tin sách thành công.",
		sach: sach,
	});
}

export async function updateSach(req: Request, res: Response) {
	const { maSach } = req.params as { maSach: string };
	const payload = req.body as UpdateSachPayload;

	const updatedSach = await sachService.updateSach(maSach, payload);

	res.status(200).json({
		message: "Cập nhật sách thành công.",
		sach: updatedSach,
	});
}

export async function deleteSach(req: Request, res: Response) {
	const { maSach } = req.params as { maSach: string };

	await sachService.deleteSach(maSach);

	res.status(200).json({
		message: "Xóa sách thành công.",
	});
}
