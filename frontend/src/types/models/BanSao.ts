import type { Sach } from "./Sach";

export interface BanSao {
    _id: string;
    maBanSao: string;
    trangThai: "AVAILABLE" | "BORROWED" | "LOST" | "DAMAGED";
    sach: Sach;
    createdAt?: string;
    updatedAt?: string;
}
