import api from "@/api/axios";
import type { RegisterPayload } from "./types";
import type { DocGia } from "@/types/models/DocGia";
import type { NhanVien } from "@/types/models/NhanVien";

export const authApi = {
    loginReader: async (payload: {
        maDocGia: string;
        matKhau: string;
    }): Promise<{ token: string; user: DocGia }> => {
        const { data } = await api.post("/auth/docgia-login", payload);
        return data;
    },

    loginStaff: async (payload: {
        maNhanVien: string;
        matKhau: string;
    }): Promise<{ token: string; user: NhanVien }> => {
        const { data } = await api.post("/auth/nhanvien-login", payload);
        return data;
    },

    registerReader: async (payload: RegisterPayload): Promise<DocGia> => {
        const { data } = await api.post("/docgia", payload);
        return data;
    },
};
