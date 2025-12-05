import type { DanhMuc } from "./DanhMuc";
import type { NhaXuatBan } from "./NhaXuatBan";
import type { TacGia } from "./TacGia";

export interface Sach {
    maSach: string;
    tenSach: string;
    namXuatBan: number;
    soLuongBanSao?: number;

    nhaXuatBan: NhaXuatBan;
    tacGia: TacGia[];
    danhMuc: DanhMuc[];

    _id: string;
}
