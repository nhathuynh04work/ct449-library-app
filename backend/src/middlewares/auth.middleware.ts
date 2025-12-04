import { UnauthorizedException } from "@/errors/unauthorized.js";
import { verifyToken, type TokenPayload } from "@/utils/jwt.js";
import type { NextFunction, Request, Response } from "express";

declare global {
	namespace Express {
		interface Request {
			user: TokenPayload;
		}
	}
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header || !header.startsWith("Bearer ")) {
		throw new UnauthorizedException("Vui lòng đăng nhập để tiếp tục.");
	}

	const token = header.split(" ")[1];

	if (!token) {
		throw new UnauthorizedException("Token không hợp lệ.");
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		throw new UnauthorizedException(
			"Phiên đăng nhập hết hạn hoặc không hợp lệ."
		);
	}
}
