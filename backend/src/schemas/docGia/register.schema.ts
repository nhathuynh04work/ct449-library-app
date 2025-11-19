import { GioiTinh } from "@/constants/index.js";
import z from "zod";

const RegisterDocGiaBodySchema = z.object({
	HoLot: z.string().min(1, "Thiếu họ và tên đệm."),
	Ten: z.string().min(1, "Thiếu tên."),
	NgaySinh: z
		.string()
		.pipe(z.coerce.date())
		.refine((date) => date < new Date(), "Ngày sinh không hợp lệ."),
	GioiTinh: z.enum(GioiTinh, "Thiếu giới tính."),
	Password: z.string().min(8, "Mật khẩu (Password) phải có ít nhất 8 ký tự."),
	DiaChi: z.string().min(5, "Địa chỉ không hợp lệ."),
	SoDienThoai: z
		.string()
		.regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0."),
});

export const RegisterDocGiaSchema = z.object({
	body: RegisterDocGiaBodySchema,
});

export type RegisterDocGiaPayload = z.infer<typeof RegisterDocGiaBodySchema>;
