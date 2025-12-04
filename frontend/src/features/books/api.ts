import api from "@/api/axios";
import type { Sach } from "@/types/models/Sach";

export interface CreateBookPayload {
    tenSach: string;
    namXuatBan: number;
    tacGia: string[];
    danhMuc: string[];
    nhaXuatBan: string;
}

export const booksApi = {
    getAll: async (): Promise<Sach[]> => {
        const { data } = await api.get("/sach");
        return data;
    },

    create: async (payload: CreateBookPayload): Promise<Sach> => {
        const { data } = await api.post("/sach", payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sach/${id}`);
    },
};
