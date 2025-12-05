import type { TacGia } from "./TacGia";
import type { NhaXuatBan } from "./NhaXuatBan";
import type { DanhMuc } from "./DanhMuc";

export interface Sach {
    _id: string;
    maSach: string;
    tenSach: string;
    hinhAnh?: string;
    namXuatBan: number;
    moTa?: string;
    soLuongBanSao: number;
    soLuongKhaDung: number;

    tacGia: TacGia[];
    nhaXuatBan: string | NhaXuatBan;
    danhMuc: DanhMuc[];

    createdAt?: string;
    updatedAt?: string;
}
