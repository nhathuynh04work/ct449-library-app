import type { Request, Response } from "express";
import * as banSaoService from "@/services/banSao.service.js";
import type { CreateBanSaoPayload } from "@/schemas/banSao/create.schema.js";
import type { UpdateBanSaoPayload } from "@/schemas/banSao/update.schema.js";

export async function createBanSao(req: Request, res: Response) {
	const payload = req.body as CreateBanSaoPayload;
	const newBanSao = await banSaoService.createBanSao(payload);

	res.status(201).json({
		message: "Tạo bản sao thành công.",
		banSao: newBanSao,
	});
}

export async function getAllBanSao(req: Request, res: Response) {
	const listBanSao = await banSaoService.getAllBanSao();

	res.status(200).json({
		message: "Lấy danh sách bản sao thành công.",
		data: listBanSao,
	});
}

export async function getBanSaoByMa(req: Request, res: Response) {
	const { maBanSao } = req.params as { maBanSao: string };
	const banSao = await banSaoService.getBanSaoByMa(maBanSao);

	res.status(200).json({
		message: "Lấy thông tin bản sao thành công.",
		banSao: banSao,
	});
}

export async function updateBanSao(req: Request, res: Response) {
	const { maBanSao } = req.params as { maBanSao: string };
	const payload = req.body as UpdateBanSaoPayload;

	const updatedBanSao = await banSaoService.updateBanSao(maBanSao, payload);

	res.status(200).json({
		message: "Cập nhật bản sao thành công.",
		banSao: updatedBanSao,
	});
}

export async function deleteBanSao(req: Request, res: Response) {
	const { maBanSao } = req.params as { maBanSao: string };

	await banSaoService.deleteBanSao(maBanSao);

	res.status(200).json({
		message: "Xóa bản sao thành công.",
	});
}
