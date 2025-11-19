import { ChucVu, GioiTinh } from "@/constants/index.js";
import z from "zod";

const CreateNhanVienBodySchema = z.object({
	HoLot: z.string().min(1, "Thiếu họ và tên đệm."),
	Ten: z.string().min(1, "Thiếu tên."),
	NgaySinh: z
		.string()
		.pipe(z.coerce.date())
		.refine((date) => date < new Date(), "Ngày sinh không hợp lệ."),
	GioiTinh: z.enum(Object.values(GioiTinh), "Thiếu giới tính."),
	Password: z.string().min(8, "Mật khẩu (Password) phải có ít nhất 8 ký tự."),
	DiaChi: z.string().min(5, "Địa chỉ không hợp lệ."),
	SoDienThoai: z
		.string()
		.regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0."),
	ChucVu: z.enum(Object.values(ChucVu)),
});

export const CreateNhanVienSchema = z.object({
	body: CreateNhanVienBodySchema,
});

export type CreateNhanVienPayload = z.infer<typeof CreateNhanVienBodySchema>;
