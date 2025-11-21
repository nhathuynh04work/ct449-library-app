import { NotFoundException } from "@/errors/not-found.js";
import { Sach, type ISach } from "@/models/Sach.js";
import type { CreateSachPayload } from "@/schemas/sach/create.schema.js";
import type { UpdateSachPayload } from "@/schemas/sach/update.schema.js";

export async function createSach(payload: CreateSachPayload) {
	const newSach = await Sach.create(payload);
	return newSach.toObject();
}

export async function getAllSach(): Promise<ISach[]> {
    const result = await Sach.find()
        .populate("tacGia danhMuc nhaXuatBan")
        .lean();

    return result as ISach[]; 
}

export async function getSachByMa(maSach: string): Promise<ISach> {
	const sach = await Sach.findOne({ maSach })
		.populate("tacGia danhMuc nhaXuatBan")
		.lean();

	if (!sach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return sach as ISach;
}

export async function updateSach(maSach: string, payload: UpdateSachPayload) {
	const updatedSach = await Sach.findOneAndUpdate(
		{ maSach: maSach },
		payload,
		{ new: true }
	);

	if (!updatedSach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return updatedSach.toObject();
}

export async function deleteSach(maSach: string) {
	const deletedSach = await Sach.findOneAndDelete({
		maSach: maSach,
	});

	if (!deletedSach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return deletedSach.toObject();
}
