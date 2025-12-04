import type { ChucVu } from "../shared/ChucVu";
import type { GioiTinh } from "../shared/GioiTinh";

export interface NhanVien {
    maNhanVien: string;
    hoLot: string;
    ten: string;
    ngaySinh: Date;
    gioiTinh: GioiTinh;
    chucVu: ChucVu;
    diaChi: string;
    soDienThoai: string;
}
