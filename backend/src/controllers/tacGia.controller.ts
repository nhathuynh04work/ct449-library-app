import type { Request, Response } from "express";
import * as tacGiaService from "@/services/tacGia.service.js";
import type { CreateTacGiaPayload } from "@/schemas/tacGia/create.schema.js";
import type { UpdateTacGiaPayload } from "@/schemas/tacGia/update.schema.js";

export async function createTacGia(req: Request, res: Response) {
	const payload = req.body as CreateTacGiaPayload;
	const newTacGia = await tacGiaService.createTacGia(payload);

	res.status(201).json({
		message: "Tạo tác giả thành công.",
		tacGia: newTacGia,
	});
}

export async function getAllTacGia(req: Request, res: Response) {
	const listTacGia = await tacGiaService.getAllTacGia();

	res.status(200).json({
		message: "Lấy danh sách tác giả thành công.",
		data: listTacGia,
	});
}

export async function updateTacGia(req: Request, res: Response) {
	const { maTacGia } = req.params as { maTacGia: string };
	const payload = req.body as UpdateTacGiaPayload;

	const updatedTacGia = await tacGiaService.updateTacGia(maTacGia, payload);

	res.status(200).json({
		message: "Cập nhật tác giả thành công.",
		tacGia: updatedTacGia,
	});
}

export async function deleteTacGia(req: Request, res: Response) {
	const { maTacGia } = req.params as { maTacGia: string };

	await tacGiaService.deleteTacGia(maTacGia);

	res.status(200).json({
		message: "Xóa tác giả thành công.",
	});
}
