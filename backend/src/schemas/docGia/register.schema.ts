import { GioiTinh } from "@/constants/index.js";
import z from "zod";

const RegisterDocGiaBodySchema = z.object({
	hoLot: z.string().min(1, "Thiếu họ và tên đệm."),
	ten: z.string().min(1, "Thiếu tên."),
	ngaySinh: z.coerce
		.date({
			message: "Ngày sinh không hợp lệ.",
		})
		.refine((date) => !isNaN(date.getTime()), {
			message: "Ngày sinh không tồn tại hoặc sai định dạng.",
		})
		.refine((date) => date < new Date(), {
			message: "Ngày sinh phải nhỏ hơn ngày hiện tại.",
		}),
	gioiTinh: z.enum(Object.values(GioiTinh), "Thiếu giới tính."),
	matKhau: z.string().min(8, "Mật khẩu (Password) phải có ít nhất 8 ký tự."),
	diaChi: z.string().min(5, "Địa chỉ không hợp lệ."),
	soDienThoai: z
		.string()
		.regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0."),
});

export const RegisterDocGiaSchema = z.object({
	body: RegisterDocGiaBodySchema,
});

export type RegisterDocGiaPayload = z.infer<typeof RegisterDocGiaBodySchema>;
