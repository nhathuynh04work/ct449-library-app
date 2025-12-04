import api from "@/api/axios";
import type { Sach } from "@/types/models/Sach";

export const booksApi = {
    getAll: async (): Promise<Sach[]> => {
        const { data } = await api.get("/sach");
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sach/${id}`);
    },
};
