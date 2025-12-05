import { Sach } from "@/models/Sach.js";
import { DocGia } from "@/models/DocGia.js";
import { TheoDoiMuonSach, TrangThaiMuon } from "@/models/TheoDoiMuonSach.js";

export async function getDashboardStats() {
	// Run counts in parallel for performance
	const [totalBooks, totalReaders, activeLoans, newRequests] =
		await Promise.all([
			Sach.countDocuments(),
			DocGia.countDocuments(),
			TheoDoiMuonSach.countDocuments({
				trangThai: TrangThaiMuon.DANG_MUON,
			}),
			TheoDoiMuonSach.countDocuments({
				trangThai: TrangThaiMuon.DANG_CHO,
			}),
		]);

	return {
		totalBooks,
		totalReaders,
		activeLoans,
		newRequests,
	};
}
