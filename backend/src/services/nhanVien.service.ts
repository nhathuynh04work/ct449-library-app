import { ConflictException } from "@/errors/conflict.js";
import { NhanVien } from "@/models/NhanVien.js";
import type { RegisterNhanVienPayload } from "@/schemas/nhanVien/register.schema.js";
import { hash } from "bcrypt";

export async function registerNhanVien(payload: RegisterNhanVienPayload) {
	const existingByPhone = await NhanVien.findOne({
		SoDienThoai: payload.soDienThoai,
	});

	if (existingByPhone)
		throw new ConflictException("This phone number is already in use");

	const hashed = await hash(payload.matKhau, 10);
	const newNhanVien = new NhanVien({ ...payload, matKhau: hashed });

	try {
		const savedNhanVien = await newNhanVien.save();
		return savedNhanVien.toObject();
	} catch (error: any) {
		// Duplicate (race condition)
		if (error.code === 11000) {
			const field = Object.keys(error.keyValue)[0];
			throw new ConflictException(`This ${field} is already in use`);
		}

		throw error;
	}
}
