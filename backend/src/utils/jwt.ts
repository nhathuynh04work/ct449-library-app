import jwt from "jsonwebtoken";
import "dotenv/config";

type Role = "READER" | "LIBRARIAN" | "ADMIN";

export interface TokenPayload {
	_id: string;
	identifier: string;
	role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload: TokenPayload): string {
	return jwt.sign(payload, JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
	try {
		const decoded = jwt.verify(token, JWT_SECRET!) as TokenPayload;
		return decoded;
	} catch (e) {
		throw new Error("Invalid or expired token.");
	}
}
