import type { Request, Response } from "express";
import * as nhaXuatBanService from "@/services/nhaXuatBan.service.js";
import type { CreateNhaXuatBanPayload, UpdateNhaXuatBanPayload } from "@/schemas/nhaXuatBan.schema.js";

export async function createNhaXuatBan(req: Request, res: Response) {
	const payload = req.body as CreateNhaXuatBanPayload;
	const newNXB = await nhaXuatBanService.createNhaXuatBan(payload);

	res.status(201).json(newNXB);
}

export async function getAllNhaXuatBan(req: Request, res: Response) {
	const listNXB = await nhaXuatBanService.getAllNhaXuatBan();

	res.status(200).json(listNXB);
}

export async function updateNhaXuatBan(req: Request, res: Response) {
	const { maNhaXuatBan } = req.params as { maNhaXuatBan: string };
	const payload = req.body as UpdateNhaXuatBanPayload;

	const updatedNXB = await nhaXuatBanService.updateNhaXuatBan(
		maNhaXuatBan,
		payload
	);

	res.status(200).json(updatedNXB);
}

export async function deleteNhaXuatBan(req: Request, res: Response) {
	const { maNhaXuatBan } = req.params as { maNhaXuatBan: string };

	await nhaXuatBanService.deleteNhaXuatBan(maNhaXuatBan);

	res.status(204).end();
}
