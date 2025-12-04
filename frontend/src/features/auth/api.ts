import api from "@/api/axios";
import type { RegisterPayload, AuthResponse } from "./types";

export const authApi = {
    loginReader: async (payload: { maDocGia: string; matKhau: string }): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/docgia-login", payload);
        return data;
    },

    loginStaff: async (payload: { maNhanVien: string; matKhau: string }): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/nhanvien-login", payload);
        return data;
    },

    registerReader: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/docgia", payload);
        return data;
    },
};
