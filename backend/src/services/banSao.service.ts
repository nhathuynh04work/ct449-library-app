import { NotFoundException } from "@/errors/not-found.js";
import { BanSao, type IBanSao } from "@/models/BanSao.js";
import type { CreateBanSaoPayload } from "@/schemas/banSao/create.schema.js";
import type { UpdateBanSaoPayload } from "@/schemas/banSao/update.schema.js";

export async function createBanSao(payload: CreateBanSaoPayload) {
	const newBanSao = await BanSao.create(payload);
	return newBanSao.toObject();
}

export async function getAllBanSao(): Promise<IBanSao[]> {
	const listBanSao = await BanSao.find()
		.populate({
			path: "sach",
			populate: { path: "tacGia danhMuc nhaXuatBan" },
		})
		.lean();

	return listBanSao as IBanSao[];
}

export async function getBanSaoByMa(maBanSao: string): Promise<IBanSao> {
	const banSao = await BanSao.findOne({ maBanSao })
		.populate({
			path: "sach",
			populate: { path: "tacGia danhMuc nhaXuatBan" },
		})
		.lean();

	if (!banSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return banSao as IBanSao;
}

export async function updateBanSao(
	maBanSao: string,
	payload: UpdateBanSaoPayload
) {
	const updatedBanSao = await BanSao.findOneAndUpdate(
		{ maBanSao: maBanSao },
		payload,
		{ new: true }
	);

	if (!updatedBanSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return updatedBanSao.toObject();
}

export async function deleteBanSao(maBanSao: string) {
	const deletedBanSao = await BanSao.findOneAndDelete({
		maBanSao: maBanSao,
	});

	if (!deletedBanSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return deletedBanSao.toObject();
}
