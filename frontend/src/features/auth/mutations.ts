import { useMutation } from "@tanstack/vue-query";
import { authApi } from "./api";
import type { LoginPayload, RegisterPayload } from "./types";

export function useLogin() {
    return useMutation({
        mutationFn: async ({
            type,
            payload,
        }: {
            type: "READER" | "STAFF";
            payload: LoginPayload;
        }) => {
            if (type === "READER") {
                return authApi.loginReader({
                    maDocGia: payload.identifier,
                    matKhau: payload.password,
                });
            } else {
                return authApi.loginStaff({
                    maNhanVien: payload.identifier,
                    matKhau: payload.password,
                });
            }
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: (payload: RegisterPayload) => authApi.registerReader(payload),
    });
}
