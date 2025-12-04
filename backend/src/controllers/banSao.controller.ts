import type { Request, Response } from "express";
import * as banSaoService from "@/services/banSao.service.js";
import type { CreateBanSaoPayload, UpdateBanSaoPayload } from "@/schemas/banSao.schema.js";

export async function createBanSao(req: Request, res: Response) {
	const payload = req.body as CreateBanSaoPayload;
	const newBanSao = await banSaoService.createBanSao(payload);

	res.status(201).json(newBanSao);
}

export async function getAllBanSao(req: Request, res: Response) {
	const listBanSao = await banSaoService.getAllBanSao();

	res.status(200).json(listBanSao);
}

export async function getBanSaoByMa(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const banSao = await banSaoService.getBanSaoById(id);

	res.status(200).json(banSao);
}

export async function updateBanSao(req: Request, res: Response) {
	const { maBanSao } = req.params as { maBanSao: string };
	const payload = req.body as UpdateBanSaoPayload;

	const updatedBanSao = await banSaoService.updateBanSao(maBanSao, payload);

	res.status(200).json(updatedBanSao);
}

export async function deleteBanSao(req: Request, res: Response) {
	const { maBanSao } = req.params as { maBanSao: string };

	await banSaoService.deleteBanSao(maBanSao);

	res.status(204).end();
}
