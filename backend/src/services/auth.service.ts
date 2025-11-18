import { ConflictException } from "@/errors/conflict.js";
import { NhanVien } from "@/models/NhanVien.js";
import type { CreateNhanVienPayload } from "@/schemas/auth/register.schema.js";
import * as bcrypt from "bcrypt";

export async function registerNhanVien(payload: CreateNhanVienPayload) {
	const existingByPhone = await NhanVien.findOne({
		SoDienThoai: payload.SoDienThoai,
	});

	if (existingByPhone)
		throw new ConflictException("This phone number is already in use");

	const hashed = await bcrypt.hash(payload.Password, 10);
	const newNhanVien = new NhanVien({ ...payload, Password: hashed });

	try {
		return newNhanVien.save();
	} catch (error: any) {
		// Duplicate (race condition)
		if (error.code === 11000) {
			const field = Object.keys(error.keyValue)[0];
			throw new ConflictException(`This ${field} is already in use`);
		}

		throw error;
	}
}
