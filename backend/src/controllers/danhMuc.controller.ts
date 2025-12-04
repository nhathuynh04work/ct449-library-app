import type { Request, Response } from "express";
import * as danhMucService from "../services/danhMuc.service.js";
import type {
	CreateDanhMucPayload,
	UpdateDanhMucPayload,
} from "@/schemas/danhMuc.schema.js";

export async function getAllDanhMuc(req: Request, res: Response) {
	const listDanhMuc = await danhMucService.getAllDanhMuc();

	res.status(200).json(listDanhMuc);
}

export async function createDanhMuc(req: Request, res: Response) {
	const payload = req.body as CreateDanhMucPayload;

	const newDanhMuc = await danhMucService.createDanhMuc(payload);
	res.status(201).json(newDanhMuc);
}

export async function updateDanhMuc(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const payload = req.body as UpdateDanhMucPayload;

	const updatedDanhMuc = await danhMucService.updateDanhMuc(id, payload);

	res.status(200).json(updatedDanhMuc);
}

export async function deleteDanhMuc(req: Request, res: Response) {
	const { id } = req.params as { id: string };

	await danhMucService.deleteDanhMuc(id);

	res.status(204).end();
}
