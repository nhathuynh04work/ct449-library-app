import api from "@/api/axios";
import type { NhanVien } from "@/types/models/NhanVien";
import type { DocGia } from "@/types/models/DocGia";

export const managementApi = {
    // Staff
    getAllStaff: async (): Promise<NhanVien[]> => {
        const { data } = await api.get("/nhanvien");
        return data;
    },
    createStaff: async (payload: any): Promise<NhanVien> => {
        const { data } = await api.post("/nhanvien", payload);
        return data;
    },

    // Readers
    getAllReaders: async (): Promise<DocGia[]> => {
        const { data } = await api.get("/docgia");
        return data;
    },
    createReader: async (payload: any): Promise<DocGia> => {
        const { data } = await api.post("/docgia", payload);
        return data;
    },

    getDashboardStats: async () => {
        const { data } = await api.get("/dashboard/stats");
        return data;
    },
};
