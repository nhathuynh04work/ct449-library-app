import { ChucVuNhanVien } from "@/models/NhanVien.js";
import z from "zod";

// Register
export const CreateNhanVienBodySchema = z.object({
	HoTenNV: z.string().min(3, "HoTenNV must be at least 3 characters"),
	Password: z.string().min(6, "Password must be at least 6 characters"),
	DiaChi: z.string().min(3, "Address must be at least 3 characters"),
	SoDienThoai: z
		.string()
		.length(10, "Phone number must have exactly 10 characters"),
	ChucVu: z.enum(Object.values(ChucVuNhanVien)),
});

export const CreateNhanVienSchema = z.object({
	body: CreateNhanVienBodySchema,
});

export type CreateNhanVienPayload = z.infer<typeof CreateNhanVienBodySchema>;
