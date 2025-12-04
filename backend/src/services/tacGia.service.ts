import { NotFoundException } from "@/errors/not-found.js";
import { TacGia } from "@/models/TacGia.js";
import type { CreateTacGiaPayload } from "@/schemas/tacGia.schema.js";
import type { UpdateTacGiaPayload } from "@/schemas/tacGia/update.schema.js";

export async function createTacGia(payload: CreateTacGiaPayload) {
	const newTacGia = await TacGia.create(payload);
	return newTacGia.toObject();
}

export async function getAllTacGia() {
	return await TacGia.find().lean();
}

export async function updateTacGia(
	maTacGia: string,
	payload: UpdateTacGiaPayload
) {
	const updatedTacGia = await TacGia.findOneAndUpdate(
		{ maTacGia: maTacGia },
		payload,
		{ new: true }
	);

	if (!updatedTacGia) {
		throw new NotFoundException("Không tìm thấy tác giả.");
	}

	return updatedTacGia.toObject();
}

export async function deleteTacGia(maTacGia: string) {
	const deletedTacGia = await TacGia.findOneAndDelete({
		maTacGia: maTacGia,
	});

	if (!deletedTacGia) {
		throw new NotFoundException("Không tìm thấy tác giả.");
	}

	return deletedTacGia.toObject();
}
