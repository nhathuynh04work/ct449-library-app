import { ChucVu, GioiTinh } from "@/constants/index.js";
import z from "zod";

const RegisterNhanVienBodySchema = z.object({
	hoLot: z.string().min(1, "Thiếu họ và tên đệm."),
	ten: z.string().min(1, "Thiếu tên."),
	ngaySinh: z
		.string()
		.pipe(z.coerce.date())
		.refine((date) => date < new Date(), "Ngày sinh không hợp lệ."),
	gioiTinh: z.enum(Object.values(GioiTinh), "Thiếu giới tính."),
	matKhau: z.string().min(8, "Mật khẩu (Password) phải có ít nhất 8 ký tự."),
	diaChi: z.string().min(5, "Địa chỉ không hợp lệ."),
	soDienThoai: z
		.string()
		.regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0."),
	chucVu: z.enum(Object.values(ChucVu)),
});

export const RegisterNhanVienSchema = z.object({
	body: RegisterNhanVienBodySchema,
});

export type RegisterNhanVienPayload = z.infer<
	typeof RegisterNhanVienBodySchema
>;
