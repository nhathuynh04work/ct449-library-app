import type { Request, Response } from "express";
import * as sachService from "@/services/sach.service.js";
import type {
	CreateSachPayload,
	UpdateSachPayload,
} from "@/schemas/sach.schema.js";

export async function createSach(req: Request, res: Response) {
	const payload = req.body as CreateSachPayload;
	const newSach = await sachService.createSach(payload);

	res.status(201).json(newSach);
}

export async function getAllSach(req: Request, res: Response) {
	const listSach = await sachService.getAllSach();

	res.status(200).json(listSach);
}

export async function getSachById(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const sach = await sachService.getSachById(id);

	res.status(200).json(sach);
}

export async function updateSach(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const payload = req.body as UpdateSachPayload;

	const updatedSach = await sachService.updateSach(id, payload);

	res.status(200).json(updatedSach);
}

export async function deleteSach(req: Request, res: Response) {
	const { id } = req.params as { id: string };

	await sachService.deleteSach(id);

	res.status(204).end();
}

export async function muonSach(req: Request, res: Response) {
	const sachId = req.params.id as string;
	const result = await sachService.muonSach({
		docGiaId: req.user.identifier,
		sachId,
	});

	res.status(201).json(result);
}
