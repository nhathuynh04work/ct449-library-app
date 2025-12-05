import { NotFoundException } from "@/errors/not-found.js";
import { TacGia } from "@/models/TacGia.js";
import type {
	CreateTacGiaPayload,
	UpdateTacGiaPayload,
} from "@/schemas/tacGia.schema.js";
export async function createTacGia(payload: CreateTacGiaPayload) {
	const newTacGia = await TacGia.create(payload);
	return newTacGia.toObject();
}

export async function getAllTacGia() {
	return await TacGia.aggregate([
		{
			$lookup: {
				from: "saches",
				localField: "_id",
				foreignField: "tacGia",
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

export async function updateTacGia(id: string, payload: UpdateTacGiaPayload) {
	const updatedTacGia = await TacGia.findByIdAndUpdate(id, payload, {
		new: true,
	});

	if (!updatedTacGia) {
		throw new NotFoundException("Không tìm thấy tác giả.");
	}

	return updatedTacGia.toObject();
}

export async function deleteTacGia(id: string) {
	const deletedTacGia = await TacGia.findByIdAndDelete(id);

	if (!deletedTacGia) {
		throw new NotFoundException("Không tìm thấy tác giả.");
	}

	return deletedTacGia.toObject();
}
