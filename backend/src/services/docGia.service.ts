import { NotFoundException } from "@/errors/not-found.js";
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

export async function toggleBlockDocGia(id: string) {
	const docGia = await DocGia.findById(id);
	if (!docGia) {
		throw new NotFoundException("Không tìm thấy độc giả.");
	}

	docGia.biKhoa = !docGia.biKhoa;
	await docGia.save();

	return docGia.toObject();
}
