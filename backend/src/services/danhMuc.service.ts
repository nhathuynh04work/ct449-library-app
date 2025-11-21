import { NotFoundException } from "@/errors/not-found.js";
import { DanhMuc } from "@/models/DanhMuc.js";
import type { CreateDanhMucPayload } from "@/schemas/danhMuc/create.schema.js";
import type { UpdateDanhMucPayload } from "@/schemas/danhMuc/update.schema.js";

export async function getAllDanhMuc() {
	return DanhMuc.find().lean();
}

export async function createDanhMuc(payload: CreateDanhMucPayload) {
	const newDanhMuc = await DanhMuc.create(payload);
	return newDanhMuc.toObject();
}

export async function updateDanhMuc(
	maDanhMuc: string,
	payload: UpdateDanhMucPayload
) {
	const updatedDanhMuc = await DanhMuc.findOneAndUpdate(
		{ maDanhMuc: maDanhMuc },
		payload,
		{ new: true }
	);

	if (!updatedDanhMuc) {
		throw new NotFoundException("Không tìm thấy danh mục sách.");
	}

	return updatedDanhMuc.toObject();
}

export async function deleteDanhMuc(maDanhMuc: string) {
	const deletedDanhMuc = await DanhMuc.findOneAndDelete({
		maDanhMuc: maDanhMuc,
	});

	if (!deletedDanhMuc) {
		throw new NotFoundException("Không tìm thấy danh mục sách.");
	}

	return deletedDanhMuc.toObject();
}
