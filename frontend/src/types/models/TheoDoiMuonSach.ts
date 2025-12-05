import type { DocGia } from "./DocGia";
import type { BanSao } from "./BanSao";

export type TrangThaiMuon = "DANG_CHO" | "DANG_MUON" | "DA_TRA" | "DA_TU_CHOI" | "DA_HUY";

export interface TheoDoiMuonSach {
    _id: string;
    maPhieuMuon: string;
    ngayMuon: string; // ISO Date string
    hanTra: string; // ISO Date string (Added)
    ngayTra?: string;
    trangThai: TrangThaiMuon;
    docGia: DocGia;
    banSao: BanSao;
    createdAt?: string;
    updatedAt?: string;
}
