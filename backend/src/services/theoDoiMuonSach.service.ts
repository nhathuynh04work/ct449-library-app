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

const MAX_BORROW_LIMIT = 5;
const FINE_PER_DAY = 5000;

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
			// [Swap Logic from previous step kept here]
			let updatedCopy = await BanSao.findOneAndUpdate(
				{ _id: loan.banSao, trangThai: TrangThaiBanSao.AVAILABLE },
				{ trangThai: TrangThaiBanSao.BORROWED },
				{ session, new: true }
			);

			if (!updatedCopy) {
				const currentCopyInfo = await BanSao.findById(
					loan.banSao
				).session(session);
				if (!currentCopyInfo)
					throw new BadRequestException("Dữ liệu bản sao lỗi.");

				const substituteCopy = await BanSao.findOne({
					sach: currentCopyInfo.sach,
					trangThai: TrangThaiBanSao.AVAILABLE,
				}).session(session);

				if (!substituteCopy) {
					throw new BadRequestException(
						"Rất tiếc, tất cả bản sao của sách này đều đã được mượn hết."
					);
				}

				substituteCopy.trangThai = TrangThaiBanSao.BORROWED;
				await substituteCopy.save({ session });
				loan.banSao = substituteCopy._id as any;
			}

			const now = new Date();
			const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

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
					const returnDate = new Date();
					loan.ngayTra = returnDate;

					// [LOGIC 3B]: Calculate Fine
					if (returnDate > loan.hanTra) {
						const diffTime = Math.abs(
							returnDate.getTime() - loan.hanTra.getTime()
						);
						const diffDays = Math.ceil(
							diffTime / (1000 * 60 * 60 * 24)
						);

						// Calculate fine
						loan.tienPhat = diffDays * FINE_PER_DAY;
					} else {
						loan.tienPhat = 0;
					}
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

	if (!loan)
		throw new NotFoundException("Không tìm thấy yêu cầu mượn sách này.");
	if (loan.trangThai !== TrangThaiMuon.DANG_CHO) {
		throw new BadRequestException(
			"Chỉ có thể hủy yêu cầu khi đang chờ duyệt."
		);
	}

	return await updateLoanStatus(loanId, TrangThaiMuon.DA_HUY);
}
