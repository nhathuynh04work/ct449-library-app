import { ConflictException } from "@/errors/conflict.js";
import { DocGia } from "@/models/DocGia.js";
import type { CreateDocGiaPayload } from "@/schemas/docGia/register.schema.js";
import { hash } from "bcrypt";

export async function registerDocGia(payload: CreateDocGiaPayload) {
	const existingByPhone = await DocGia.findOne({
		SoDienThoai: payload.SoDienThoai,
	});

	if (existingByPhone)
		throw new ConflictException("Số điện thoại này đã được sử dụng.");

	const hashed = await hash(payload.Password, 10);
	const newDocGia = new DocGia({ ...payload, Password: hashed });

	try {
		const savedDocGia = await newDocGia.save();
		return savedDocGia.toObject();
	} catch (error: any) {
		// Duplicate (race condition)
		if (error.code === 11000) {
			const field = Object.keys(error.keyValue)[0];
			throw new ConflictException(`${field} này đã được sử dụng.`);
		}

		throw error;
	}
}
