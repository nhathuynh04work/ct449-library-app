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
		// [LOGIC ADDED]: Check if user is already borrowing this book (any copy)
		// 1. Find all copies of this book
		const bookCopies = await BanSao.find({ sach: sachId })
			.select("_id")
			.session(session);
		const copyIds = bookCopies.map((c) => c._id);

		// 2. Check for active loans (Pending or Borrowing) for these copies
		const existingLoan = await TheoDoiMuonSach.findOne({
			docGia: docGiaId,
			banSao: { $in: copyIds },
			trangThai: {
				$in: [TrangThaiMuon.DANG_CHO, TrangThaiMuon.DANG_MUON],
			},
		}).session(session);

		if (existingLoan) {
			throw new ConflictException(
				"Bạn đang mượn hoặc đã yêu cầu sách này rồi. Vui lòng trả sách trước khi mượn lại."
			);
		}

		// [LOGIC EXISTING]: Check availability
		const banSao = await BanSao.findOne({
			sach: sachId,
			trangThai: TrangThaiBanSao.AVAILABLE,
		}).session(session);

		if (!banSao) {
			throw new ConflictException(
				"Sách này hiện đã hết bản sao có sẵn để mượn."
			);
		}

		// Create record
		const phieuMuon = new TheoDoiMuonSach({
			docGia: docGiaId,
			banSao: banSao._id,
			ngayMuon: new Date(),
			// hanTra will be set by default in schema (now + 14 days),
			// but effectively reset upon approval.
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
