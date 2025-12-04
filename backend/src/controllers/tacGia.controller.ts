import type { Request, Response } from "express";
import * as tacGiaService from "@/services/tacGia.service.js";
import type {
	CreateTacGiaPayload,
	UpdateTacGiaPayload,
} from "@/schemas/tacGia.schema.js";

export async function createTacGia(req: Request, res: Response) {
	const payload = req.body as CreateTacGiaPayload;
	const newTacGia = await tacGiaService.createTacGia(payload);

	res.status(201).json(newTacGia);
}

export async function getAllTacGia(req: Request, res: Response) {
	const listTacGia = await tacGiaService.getAllTacGia();

	res.status(200).json(listTacGia);
}

export async function updateTacGia(req: Request, res: Response) {
	const { maTacGia } = req.params as { maTacGia: string };
	const payload = req.body as UpdateTacGiaPayload;

	const updatedTacGia = await tacGiaService.updateTacGia(maTacGia, payload);

	res.status(200).json(updatedTacGia);
}

export async function deleteTacGia(req: Request, res: Response) {
	const { maTacGia } = req.params as { maTacGia: string };

	await tacGiaService.deleteTacGia(maTacGia);

	res.status(204).end();
}
