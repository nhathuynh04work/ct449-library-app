import { TrangThaiBanSao } from "@/constants/trangThaiBanSao.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import { TheoDoiMuonSach, TrangThaiMuon, type TrangThaiMuonType } from "@/models/TheoDoiMuonSach.js";
import mongoose from "mongoose";

export async function getHistoryByDocGia(docGiaId: string) {
	// Find records for this reader and populate deeply to get Book info
	const history = await TheoDoiMuonSach.find({ docGia: docGiaId })
		.populate({
			path: "banSao",
			populate: {
				path: "sach",
				select: "tenSach namXuatBan maSach", // Select only needed fields
			},
		})
		.sort({ ngayMuon: -1 }); // Newest first

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

		// If Returning or Rejecting, release the Book Copy
		if (
			status === TrangThaiMuon.DA_TRA ||
			status === TrangThaiMuon.DA_TU_CHOI
		) {
			await BanSao.findByIdAndUpdate(
				loan.banSao,
				{ trangThai: TrangThaiBanSao.AVAILABLE },
				{ session }
			);

			if (status === TrangThaiMuon.DA_TRA) {
				loan.ngayTra = new Date();
			}
		}

		// If Approving, we keep the Book Copy as BORROWED (which it already is from creation)

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
