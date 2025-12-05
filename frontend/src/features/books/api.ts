import api from "@/api/axios";
import type { Sach } from "@/types/models/Sach";
import type { TheoDoiMuonSach } from "@/types/models/TheoDoiMuonSach";

export interface CreateBookPayload {
    tenSach: string;
    namXuatBan: number;
    tacGia: string[];
    hinhAnh?: string;
    moTa?: string;
    danhMuc: string[];
    nhaXuatBan: string;
}

export type UpdateBookPayload = CreateBookPayload;

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

    update: async (id: string, payload: UpdateBookPayload): Promise<Sach> => {
        const { data } = await api.put(`/sach/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sach/${id}`);
    },

    borrow: async (id: string): Promise<void> => {
        await api.post(`/sach/${id}/muon`);
    },

    getHistory: async (): Promise<TheoDoiMuonSach[]> => {
        const { data } = await api.get("/tracking/me");
        return data;
    },

    cancelRequest: async (id: string): Promise<void> => {
        await api.patch(`/tracking/${id}/cancel`);
    },
};
