export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface RegisterPayload {
    hoLot: string;
    ten: string;
    ngaySinh: string;
    gioiTinh: "Nam" | "Nữ" | "Khác";
    soDienThoai: string;
    diaChi: string;
    matKhau: string;
}

export interface AuthResponse {
    message: string;
    token: string;
}
