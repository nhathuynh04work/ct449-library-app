import api from "@/api/axios";
import type { TheoDoiMuonSach } from "@/types/models/TheoDoiMuonSach";

export const loansApi = {
    getAll: async (): Promise<TheoDoiMuonSach[]> => {
        const { data } = await api.get("/tracking");
        return data;
    },

    updateStatus: async (id: string, status: string): Promise<TheoDoiMuonSach> => {
        const { data } = await api.put(`/tracking/${id}/status`, { trangThai: status });
        return data;
    },
};
