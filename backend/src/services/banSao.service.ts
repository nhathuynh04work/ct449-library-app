import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import type {
	CreateBanSaoPayload,
	UpdateBanSaoPayload,
} from "@/schemas/banSao.schema.js";

export async function createBanSao(payload: CreateBanSaoPayload) {
	const newBanSao = await BanSao.create(payload);
	return newBanSao.toObject();
}

export async function getAllBanSao(sachId?: string) {
	const filter = sachId ? { sach: sachId } : {};

	const listBanSao = await BanSao.find(filter).populate({
		path: "sach",
		populate: { path: "tacGia danhMuc nhaXuatBan" },
	});

	return listBanSao;
}

export async function getBanSaoById(banSaoId: string) {
	const banSao = await BanSao.findById(banSaoId).populate({
		path: "sach",
		populate: { path: "tacGia danhMuc nhaXuatBan" },
	});

	if (!banSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return banSao;
}

export async function updateBanSao(
	banSaoId: string,
	payload: UpdateBanSaoPayload
) {
	const updatedBanSao = await BanSao.findByIdAndUpdate(banSaoId, payload, {
		new: true,
	});

	if (!updatedBanSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return updatedBanSao.toObject();
}

export async function deleteBanSao(banSaoId: string) {
	const deletedBanSao = await BanSao.findByIdAndDelete(banSaoId);

	if (!deletedBanSao) {
		throw new NotFoundException("Không tìm thấy bản sao.");
	}

	return deletedBanSao.toObject();
}
