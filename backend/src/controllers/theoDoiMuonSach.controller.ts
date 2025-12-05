import type { Request, Response } from "express";
import * as service from "@/services/theoDoiMuonSach.service.js";

export async function getMyHistory(req: Request, res: Response) {
	const result = await service.getHistoryByDocGia(req.user.identifier);
	res.status(200).json(result);
}

export async function getAllLoans(req: Request, res: Response) {
	const result = await service.getAllLoans();
	res.status(200).json(result);
}

export async function updateLoanStatus(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const { trangThai } = req.body;

	const result = await service.updateLoanStatus(id, trangThai);
	res.status(200).json(result);
}

export async function cancelMyLoan(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	// req.user is populated by auth middleware
	const result = await service.cancelLoanByUser(req.user.identifier, id);
	res.status(200).json(result);
}
