import type { GioiTinh } from "@/types/shared/GioiTinh";

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface RegisterPayload {
    hoLot: string;
    ten: string;
    ngaySinh: string;
    gioiTinh: GioiTinh;
    soDienThoai: string;
    diaChi: string;
    matKhau: string;
}

export interface LoginData {
    token: string;
}
