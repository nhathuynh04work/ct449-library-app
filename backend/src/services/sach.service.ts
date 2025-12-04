import { TrangThaiBanSao } from "@/constants/trangThaiBanSao.js";
import { ConflictException } from "@/errors/conflict.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import { Sach, type ISach } from "@/models/Sach.js";
import { TheoDoiMuonSach } from "@/models/TheoDoiMuonSach.js";
import type {
	CreateSachPayload,
	UpdateSachPayload,
} from "@/schemas/sach.schema.js";
import mongoose from "mongoose";

export async function createSach(payload: CreateSachPayload) {
	const newSach = await Sach.create(payload);
	return newSach.toObject();
}

export async function getAllSach() {
	const result = await Sach.find()
		.populate("tacGia danhMuc nhaXuatBan")
		.lean();

	return result as ISach[];
}

export async function getSachById(id: string) {
	const sach = await Sach.findById(id)
		.populate("tacGia danhMuc nhaXuatBan")
		.lean();

	if (!sach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return sach as ISach;
}

export async function updateSach(id: string, payload: UpdateSachPayload) {
	const updatedSach = await Sach.findByIdAndUpdate(id, payload, {
		new: true,
	});

	if (!updatedSach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return updatedSach.toObject();
}

export async function deleteSach(id: string) {
	const deletedSach = await Sach.findByIdAndDelete(id);

	if (!deletedSach) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	return deletedSach.toObject();
}

export async function muonSach(params: { docGiaId: string; sachId: string }) {
	const { docGiaId, sachId } = params;
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const banSao = await BanSao.findOneAndUpdate(
			{
				sach: sachId,
				trangThai: TrangThaiBanSao.AVAILABLE,
			},
			{
				trangThai: TrangThaiBanSao.BORROWED,
			},
			{ new: true, session: session }
		);

		if (!banSao) {
			throw new ConflictException(
				"Sách này hiện đã hết bản sao có sẵn để mượn."
			);
		}

		const phieuMuon = new TheoDoiMuonSach({
			docGia: docGiaId,
			banSao: banSao._id,
			ngayMuon: new Date(),
		});

		await phieuMuon.save({ session });

		await session.commitTransaction();

		return {
			...phieuMuon.toObject(),
			maBanSao: banSao.maBanSao,
		};
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}
