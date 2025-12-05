import api from "@/api/axios";
import type { BanSao } from "@/types/models/BanSao";

export const copiesApi = {
    getByBookId: async (sachId: string): Promise<BanSao[]> => {
        const { data } = await api.get("/bansao", { params: { sachId } });
        return data;
    },

    create: async (sachId: string): Promise<BanSao> => {
        const { data } = await api.post("/bansao", { sach: sachId });
        return data;
    },

    updateStatus: async (id: string, status: string): Promise<BanSao> => {
        const { data } = await api.put(`/bansao/${id}`, { trangThai: status });
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/bansao/${id}`);
    },
};
