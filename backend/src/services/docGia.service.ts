import { DocGia } from "@/models/DocGia.js";
import type { RegisterDocGiaPayload } from "@/schemas/docGia.schema.js";
import { hash } from "bcrypt";

export async function registerDocGia(payload: RegisterDocGiaPayload) {
	const hashed = await hash(payload.matKhau, 10);
	const newDocGia = await DocGia.create({
		...payload,
		matKhau: hashed,
	});

	return newDocGia.toObject();
}

export async function getAllDocGia() {
	return await DocGia.find().select("-matKhau").sort({ createdAt: -1 });
}
