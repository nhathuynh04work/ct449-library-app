import type { TacGia } from "./TacGia";
import type { DanhMuc } from "./DanhMuc";
import type { NhaXuatBan } from "./NhaXuatBan";

export interface Sach {
    _id: string;
    maSach: string;
    tenSach: string;
    namXuatBan: number;

    // [NEW FIELDS]
    hinhAnh?: string;
    moTa?: string;

    // Relations
    tacGia: TacGia[];
    danhMuc: DanhMuc[];
    nhaXuatBan: NhaXuatBan | string;

    // Augmented fields
    soLuongBanSao?: number;
    soLuongKhaDung?: number;

    createdAt?: string;
    updatedAt?: string;
}
