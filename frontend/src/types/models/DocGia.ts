import type { GioiTinh } from "../shared/GioiTinh";

export interface DocGia {
    maDocGia: string;
    hoLot: string;
    ten: string;
    ngaySinh: Date;
    gioiTinh: GioiTinh;
    diaChi: string;
    soDienThoai: string;
    createdAt?: Date;
    updatedAt?: Date;

    _id: string;

}
