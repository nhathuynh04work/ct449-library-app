import api from "@/api/axios";
import type { TacGia } from "@/types/models/TacGia";
import type { NhaXuatBan } from "@/types/models/NhaXuatBan";
import type { DanhMuc } from "@/types/models/DanhMuc";

export const resourcesApi = {
    // Authors
    getAuthors: async (): Promise<TacGia[]> => {
        const { data } = await api.get("/tacgia");
        return data;
    },
    createAuthor: async (payload: { tenTacGia: string; tieuSu?: string }): Promise<TacGia> => {
        const { data } = await api.post("/tacgia", payload);
        return data;
    },
    updateAuthor: async ({
        id,
        payload,
    }: {
        id: string;
        payload: { tenTacGia?: string; tieuSu?: string };
    }): Promise<TacGia> => {
        const { data } = await api.put(`/tacgia/${id}`, payload);
        return data;
    },
    deleteAuthor: async (id: string): Promise<void> => {
        await api.delete(`/tacgia/${id}`);
    },

    // Publishers
    getPublishers: async (): Promise<NhaXuatBan[]> => {
        const { data } = await api.get("/nhaxuatban");
        return data;
    },
    createPublisher: async (payload: {
        tenNhaXuatBan: string;
        diaChi: string;
    }): Promise<NhaXuatBan> => {
        const { data } = await api.post("/nhaxuatban", payload);
        return data;
    },
    updatePublisher: async ({
        id,
        payload,
    }: {
        id: string;
        payload: { tenNhaXuatBan?: string; diaChi?: string };
    }): Promise<NhaXuatBan> => {
        const { data } = await api.put(`/nhaxuatban/${id}`, payload);
        return data;
    },
    deletePublisher: async (id: string): Promise<void> => {
        await api.delete(`/nhaxuatban/${id}`);
    },

    // Categories
    getCategories: async (): Promise<DanhMuc[]> => {
        const { data } = await api.get("/danhmuc");
        return data;
    },
    createCategory: async (payload: { tenDanhMuc: string }): Promise<DanhMuc> => {
        const { data } = await api.post("/danhmuc", payload);
        return data;
    },
    updateCategory: async ({
        id,
        payload,
    }: {
        id: string;
        payload: { tenDanhMuc: string };
    }): Promise<DanhMuc> => {
        const { data } = await api.put(`/danhmuc/${id}`, payload);
        return data;
    },
    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/danhmuc/${id}`);
    },
};
