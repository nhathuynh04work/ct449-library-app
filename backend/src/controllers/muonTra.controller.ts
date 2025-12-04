import type { Request, Response } from "express";
import * as muonTraService from "@/services/muonTra.service.js";
import type { MuonSachPayload } from "@/schemas/muonTra/muon.schema.js";

export async function muonSach(req: Request, res: Response) {
	const payload = req.body as MuonSachPayload;

	const result = await muonTraService.muonSach(req.user.identifier, payload);

	res.status(201).json({
		message: "Mượn sách thành công.",
		phieuMuon: result,
	});
}
