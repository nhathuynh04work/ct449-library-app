import type { GioiTinh } from "../shared/GioiTinh";

export interface DocGia {
    maDocGia: string;
    hoLot: string;
    ten: string;
    ngaySinh: Date;
    gioiTinh: GioiTinh;
    diaChi: string;
    soDienThoai: string;
    biKhoa?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    _id: string;
}
