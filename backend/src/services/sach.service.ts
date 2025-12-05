import { TrangThaiBanSao } from "@/constants/trangThaiBanSao.js";
import { ConflictException } from "@/errors/conflict.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import { Sach, type ISach } from "@/models/Sach.js";
import { TheoDoiMuonSach, TrangThaiMuon } from "@/models/TheoDoiMuonSach.js";
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
	const result = await Sach.aggregate([
		{
			$lookup: {
				from: "bansaos",
				localField: "_id",
				foreignField: "sach",
				as: "copies",
			},
		},
		{
			$addFields: {
				soLuongBanSao: { $size: "$copies" },
				soLuongKhaDung: {
					$size: {
						$filter: {
							input: "$copies",
							as: "copy",
							cond: {
								$eq: [
									"$$copy.trangThai",
									TrangThaiBanSao.AVAILABLE,
								],
							},
						},
					},
				},
			},
		},
		{
			$project: {
				copies: 0,
			},
		},
	]);

	await Sach.populate(result, [
		{ path: "tacGia" },
		{ path: "danhMuc" },
		{ path: "nhaXuatBan" },
	]);

	return result;
}

export async function getSachById(id: string) {
	const result = await Sach.aggregate([
		{
			$match: { _id: new mongoose.Types.ObjectId(id) },
		},
		{
			$lookup: {
				from: "bansaos",
				localField: "_id",
				foreignField: "sach",
				as: "copies",
			},
		},
		{
			$addFields: {
				soLuongBanSao: { $size: "$copies" },
				soLuongKhaDung: {
					$size: {
						$filter: {
							input: "$copies",
							as: "copy",
							cond: {
								$eq: [
									"$$copy.trangThai",
									TrangThaiBanSao.AVAILABLE,
								],
							},
						},
					},
				},
			},
		},
		{
			$project: {
				copies: 0,
			},
		},
	]);

	if (!result || result.length === 0) {
		throw new NotFoundException("Không tìm thấy sách.");
	}

	const sach = result[0];
	await Sach.populate(sach, [
		{ path: "tacGia" },
		{ path: "danhMuc" },
		{ path: "nhaXuatBan" },
	]);

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
		// UPDATED: Check for availability ONLY. Do not set to BORROWED yet.
		const banSao = await BanSao.findOne({
			sach: sachId,
			trangThai: TrangThaiBanSao.AVAILABLE,
		}).session(session);

		if (!banSao) {
			throw new ConflictException(
				"Sách này hiện đã hết bản sao có sẵn để mượn."
			);
		}

		// Create record with PENDING status
		const phieuMuon = new TheoDoiMuonSach({
			docGia: docGiaId,
			banSao: banSao._id,
			ngayMuon: new Date(),
			trangThai: TrangThaiMuon.DANG_CHO,
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
