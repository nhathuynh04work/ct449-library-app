import type { DanhMuc } from "./DanhMuc";
import type { TacGia } from "./TacGia";

export interface Sach {
    maSach: string;
    tenSach: string;
    namXuatBan: number;

    tacGia: TacGia[];
    danhMuc: DanhMuc[];
}
