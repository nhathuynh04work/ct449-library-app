import api from "@/api/axios";

export interface LoanRecord {
    _id: string;
    maPhieuMuon: string;
    ngayMuon: string;
    ngayTra?: string;
    trangThai: "DANG_CHO" | "DANG_MUON" | "DA_TRA" | "DA_TU_CHOI";
    docGia: {
        maDocGia: string;
        hoLot: string;
        ten: string;
    };
    banSao: {
        maBanSao: string;
        sach: {
            tenSach: string;
            maSach: string;
        };
    };
}

export const loansApi = {
    getAll: async (): Promise<LoanRecord[]> => {
        const { data } = await api.get("/tracking");
        return data;
    },

    updateStatus: async (id: string, status: string): Promise<LoanRecord> => {
        const { data } = await api.put(`/tracking/${id}/status`, { trangThai: status });
        return data;
    },
};
