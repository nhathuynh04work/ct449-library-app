import { TrangThaiBanSao } from "@/constants/trangThaiBanSao.js";
import { BadRequestException } from "@/errors/bad-request.js";
import { ConflictException } from "@/errors/conflict.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import { DocGia } from "@/models/DocGia.js"; // Import DocGia
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
	const hasCopies = await BanSao.exists({ sach: id });
	if (hasCopies) {
		throw new ConflictException(
			"Không thể xóa sách này vì vẫn còn bản sao trong kho."
		);
	}

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
		// [NEW LOGIC]: Check if reader is blocked
		const reader = await DocGia.findById(docGiaId).session(session);
		if (!reader) throw new NotFoundException("Không tìm thấy độc giả.");

		if (reader.biKhoa) {
			throw new BadRequestException(
				"Tài khoản của bạn đã bị khóa chức năng mượn sách. Vui lòng liên hệ thủ thư."
			);
		}

		// [LOGIC 1A]: Check Borrow Limit (Max 5 books)
		const MAX_BORROW_LIMIT = 5;
		const currentLoansCount = await TheoDoiMuonSach.countDocuments({
			docGia: docGiaId,
			trangThai: {
				$in: [TrangThaiMuon.DANG_CHO, TrangThaiMuon.DANG_MUON],
			},
		}).session(session);

		if (currentLoansCount >= MAX_BORROW_LIMIT) {
			throw new BadRequestException(
				`Bạn chỉ được phép mượn tối đa ${MAX_BORROW_LIMIT} cuốn sách cùng lúc.`
			);
		}

		// [LOGIC 1B]: Check for Overdue Books
		const overdueLoans = await TheoDoiMuonSach.findOne({
			docGia: docGiaId,
			trangThai: TrangThaiMuon.DANG_MUON,
			hanTra: { $lt: new Date() }, // Due date is in the past
		}).session(session);

		if (overdueLoans) {
			throw new BadRequestException(
				"Bạn đang có sách quá hạn chưa trả. Vui lòng trả sách trước khi mượn mới."
			);
		}

		// [LOGIC EXISTING]: Check if user is already borrowing THIS book (any copy)
		const bookCopies = await BanSao.find({ sach: sachId })
			.select("_id")
			.session(session);
		const copyIds = bookCopies.map((c) => c._id);

		const existingLoan = await TheoDoiMuonSach.findOne({
			docGia: docGiaId,
			banSao: { $in: copyIds },
			trangThai: {
				$in: [TrangThaiMuon.DANG_CHO, TrangThaiMuon.DANG_MUON],
			},
		}).session(session);

		if (existingLoan) {
			throw new ConflictException(
				"Bạn đang mượn hoặc đã yêu cầu sách này rồi."
			);
		}

		// [LOGIC EXISTING]: Find ONE available copy
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
