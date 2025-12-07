import { NotFoundException } from "@/errors/not-found.js";
import { ConflictException } from "@/errors/conflict.js";
import { DanhMuc } from "@/models/DanhMuc.js";
import { Sach } from "@/models/Sach.js";
import type {
	CreateDanhMucPayload,
	UpdateDanhMucPayload,
} from "@/schemas/danhMuc.schema.js";

export async function getAllDanhMuc() {
	return await DanhMuc.aggregate([
		{
			$lookup: {
				from: "saches",
				localField: "_id",
				foreignField: "danhMuc",
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

export async function createDanhMuc(payload: CreateDanhMucPayload) {
	const newDanhMuc = await DanhMuc.create(payload);
	return newDanhMuc.toObject();
}

export async function updateDanhMuc(id: string, payload: UpdateDanhMucPayload) {
	const updatedDanhMuc = await DanhMuc.findByIdAndUpdate(id, payload, {
		new: true,
	});

	if (!updatedDanhMuc) {
		throw new NotFoundException("Không tìm thấy danh mục sách.");
	}

	return updatedDanhMuc.toObject();
}

export async function deleteDanhMuc(id: string) {
	const isUsed = await Sach.exists({ danhMuc: id });
	if (isUsed) {
		throw new ConflictException(
			"Không thể xóa danh mục này vì vẫn còn sách thuộc về nó."
		);
	}

	const deletedDanhMuc = await DanhMuc.findByIdAndDelete(id);

	if (!deletedDanhMuc) {
		throw new NotFoundException("Không tìm thấy danh mục sách.");
	}

	return deletedDanhMuc.toObject();
}
