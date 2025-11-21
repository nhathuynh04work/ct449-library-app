import { ErrorCode } from "@/constants/errorCode.js";
import { ConflictException } from "@/errors/conflict.js";
import { DocGia } from "@/models/DocGia.js";
import type { RegisterDocGiaPayload } from "@/schemas/docGia/register.schema.js";
import { hash } from "bcrypt";

export async function registerDocGia(payload: RegisterDocGiaPayload) {
	const hashed = await hash(payload.matKhau, 10);
	const newDocGia = new DocGia({ ...payload, matKhau: hashed });

	try {
		const savedDocGia = await newDocGia.save();
		return savedDocGia.toObject();
	} catch (error: any) {
		if (error.code === ErrorCode.MONGOOSE_DUPLICATE) {
			const field = Object.keys(error.keyValue)[0];
			throw new ConflictException(`${field} này đã được sử dụng.`);
		}

		throw error;
	}
}
