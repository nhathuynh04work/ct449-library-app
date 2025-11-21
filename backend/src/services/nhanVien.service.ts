import { NhanVien } from "@/models/NhanVien.js";
import type { RegisterNhanVienPayload } from "@/schemas/nhanVien/register.schema.js";
import { hash } from "bcrypt";

export async function registerNhanVien(payload: RegisterNhanVienPayload) {
	const hashed = await hash(payload.matKhau, 10);
	const newNhanVien = await NhanVien.create({
		...payload,
		matKhau: hashed,
	});

	return newNhanVien.toObject();
}
