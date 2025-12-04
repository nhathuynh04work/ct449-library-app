import { NotFoundException } from "@/errors/not-found.js";
import { NhaXuatBan } from "@/models/NhaXuatBan.js";
import type { CreateNhaXuatBanPayload } from "@/schemas/nhaXuatBan.schema.js";
import type { UpdateNhaXuatBanPayload } from "@/schemas/nhaXuatBan/update.schema.js";

export async function createNhaXuatBan(payload: CreateNhaXuatBanPayload) {
	const newNXB = await NhaXuatBan.create(payload);
	return newNXB.toObject();
}

export async function getAllNhaXuatBan() {
	return await NhaXuatBan.find().lean();
}

export async function updateNhaXuatBan(
	maNhaXuatBan: string,
	payload: UpdateNhaXuatBanPayload
) {
	const updatedNXB = await NhaXuatBan.findOneAndUpdate(
		{ maNhaXuatBan: maNhaXuatBan },
		payload,
		{ new: true }
	);

	if (!updatedNXB) {
		throw new NotFoundException("Không tìm thấy nhà xuất bản.");
	}

	return updatedNXB.toObject();
}

export async function deleteNhaXuatBan(maNhaXuatBan: string) {
	const deletedNXB = await NhaXuatBan.findOneAndDelete({
		maNhaXuatBan: maNhaXuatBan,
	});

	if (!deletedNXB) {
		throw new NotFoundException("Không tìm thấy nhà xuất bản.");
	}

	return deletedNXB.toObject();
}
