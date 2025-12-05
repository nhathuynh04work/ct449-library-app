import api from "@/api/axios";
import type { Sach } from "@/types/models/Sach";

export interface CreateBookPayload {
    tenSach: string;
    namXuatBan: number;
    tacGia: string[];
    danhMuc: string[];
    nhaXuatBan: string;
}

export interface BorrowRecord {
    _id: string;
    ngayMuon: string;
    ngayTra?: string;
    banSao: {
        maBanSao: string;
        sach: Sach;
    };
}

export const booksApi = {
    getAll: async (): Promise<Sach[]> => {
        const { data } = await api.get("/sach");
        return data;
    },

    getById: async (id: string): Promise<Sach> => {
        const { data } = await api.get(`/sach/${id}`);
        return data;
    },

    create: async (payload: CreateBookPayload): Promise<Sach> => {
        const { data } = await api.post("/sach", payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sach/${id}`);
    },

    borrow: async (id: string): Promise<void> => {
        await api.post(`/sach/${id}/muon`);
    },

    getHistory: async (): Promise<BorrowRecord[]> => {
        const { data } = await api.get("/tracking/me");
        return data;
    },
};
