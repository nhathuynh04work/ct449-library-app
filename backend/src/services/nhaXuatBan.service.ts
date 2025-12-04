import { NotFoundException } from "@/errors/not-found.js";
import { NhaXuatBan } from "@/models/NhaXuatBan.js";
import type {
	CreateNhaXuatBanPayload,
	UpdateNhaXuatBanPayload,
} from "@/schemas/nhaXuatBan.schema.js";

export async function createNhaXuatBan(payload: CreateNhaXuatBanPayload) {
	const newNXB = await NhaXuatBan.create(payload);
	return newNXB.toObject();
}

export async function getAllNhaXuatBan() {
	return await NhaXuatBan.find().lean();
}

export async function updateNhaXuatBan(
	id: string,
	payload: UpdateNhaXuatBanPayload
) {
	const updatedNXB = await NhaXuatBan.findByIdAndUpdate(id, payload, {
		new: true,
	});

	if (!updatedNXB) {
		throw new NotFoundException("Không tìm thấy nhà xuất bản.");
	}

	return updatedNXB.toObject();
}

export async function deleteNhaXuatBan(id: string) {
	const deletedNXB = await NhaXuatBan.findByIdAndDelete(id);

	if (!deletedNXB) {
		throw new NotFoundException("Không tìm thấy nhà xuất bản.");
	}

	return deletedNXB.toObject();
}
