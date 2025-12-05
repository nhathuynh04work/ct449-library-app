import type { Request, Response } from "express";
import * as dashboardService from "@/services/dashboard.service.js";

export async function getStats(req: Request, res: Response) {
	const stats = await dashboardService.getDashboardStats();
	res.status(200).json(stats);
}
