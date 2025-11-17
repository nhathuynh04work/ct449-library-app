import { NotFoundException } from "@/errors/not-found.js";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
	throw new NotFoundException("Not implemented");
}
