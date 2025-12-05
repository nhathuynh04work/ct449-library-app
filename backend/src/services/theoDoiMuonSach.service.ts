import { TrangThaiBanSao } from "@/constants/trangThaiBanSao.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BadRequestException } from "@/errors/bad-request.js";
import { BanSao } from "@/models/BanSao.js";
import {
	TheoDoiMuonSach,
	TrangThaiMuon,
	type TrangThaiMuonType,
} from "@/models/TheoDoiMuonSach.js";
import mongoose from "mongoose";

export async function getHistoryByDocGia(docGiaId: string) {
	const history = await TheoDoiMuonSach.find({ docGia: docGiaId })
		.populate({
			path: "banSao",
			populate: {
				path: "sach",
				select: "tenSach namXuatBan maSach",
			},
		})
		.sort({ createdAt: -1 });

	return history;
}

export async function getAllLoans() {
	return await TheoDoiMuonSach.find()
		.populate("docGia")
		.populate({
			path: "banSao",
			populate: { path: "sach" },
		})
		.sort({ createdAt: -1 });
}

export async function updateLoanStatus(id: string, status: TrangThaiMuonType) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const loan = await TheoDoiMuonSach.findById(id).session(session);
		if (!loan) throw new NotFoundException("Không tìm thấy phiếu mượn.");

		const previousStatus = loan.trangThai;

		// --- APPROVING REQUEST ---
		if (
			status === TrangThaiMuon.DANG_MUON &&
			previousStatus === TrangThaiMuon.DANG_CHO
		) {
			const updatedCopy = await BanSao.findOneAndUpdate(
				{ _id: loan.banSao, trangThai: TrangThaiBanSao.AVAILABLE },
				{ trangThai: TrangThaiBanSao.BORROWED },
				{ session, new: true }
			);

			if (!updatedCopy) {
				throw new BadRequestException(
					"Bản sao này không còn khả dụng (đã bị mượn hoặc hư hỏng)."
				);
			}

			// [LOGIC ADDED]: Set Start Date and Due Date (2 weeks) upon approval
			const now = new Date();
			const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days

			loan.ngayMuon = now;
			loan.hanTra = dueDate;
		}

		// --- RETURNING / REJECTING / CANCELLING ---
		else if (
			status === TrangThaiMuon.DA_TRA ||
			status === TrangThaiMuon.DA_TU_CHOI ||
			status === TrangThaiMuon.DA_HUY
		) {
			if (previousStatus === TrangThaiMuon.DANG_MUON) {
				await BanSao.findByIdAndUpdate(
					loan.banSao,
					{ trangThai: TrangThaiBanSao.AVAILABLE },
					{ session }
				);

				if (status === TrangThaiMuon.DA_TRA) {
					loan.ngayTra = new Date();
				}
			}
		}

		loan.trangThai = status;
		await loan.save({ session });

		await session.commitTransaction();
		return loan;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

export async function cancelLoanByUser(userId: string, loanId: string) {
	const loan = await TheoDoiMuonSach.findOne({ _id: loanId, docGia: userId });

	if (!loan) {
		throw new NotFoundException("Không tìm thấy yêu cầu mượn sách này.");
	}

	if (loan.trangThai !== TrangThaiMuon.DANG_CHO) {
		throw new BadRequestException(
			"Chỉ có thể hủy yêu cầu khi đang chờ duyệt."
		);
	}

	return await updateLoanStatus(loanId, TrangThaiMuon.DA_HUY);
}
