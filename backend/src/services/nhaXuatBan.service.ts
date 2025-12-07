import { NotFoundException } from "@/errors/not-found.js";
import { ConflictException } from "@/errors/conflict.js";
import { NhaXuatBan } from "@/models/NhaXuatBan.js";
import { Sach } from "@/models/Sach.js";
import type {
	CreateNhaXuatBanPayload,
	UpdateNhaXuatBanPayload,
} from "@/schemas/nhaXuatBan.schema.js";

export async function createNhaXuatBan(payload: CreateNhaXuatBanPayload) {
	const newNXB = await NhaXuatBan.create(payload);
	return newNXB.toObject();
}

export async function getAllNhaXuatBan() {
	return await NhaXuatBan.aggregate([
		{
			$lookup: {
				from: "saches",
				localField: "_id",
				foreignField: "nhaXuatBan",
				as: "books",
			},
		},
		{
			$addFields: {
				soLuongSach: { $size: "$books" },
			},
		},
		{
			$project: {
				books: 0,
			},
		},
	]);
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
	const isUsed = await Sach.exists({ nhaXuatBan: id });
	if (isUsed) {
		throw new ConflictException(
			"Không thể xóa nhà xuất bản này vì vẫn còn sách thuộc về nó."
		);
	}

	const deletedNXB = await NhaXuatBan.findByIdAndDelete(id);

	if (!deletedNXB) {
		throw new NotFoundException("Không tìm thấy nhà xuất bản.");
	}

	return deletedNXB.toObject();
}
