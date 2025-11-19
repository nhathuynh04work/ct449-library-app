import z from "zod";

const passwordSchema = z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự.");


// NhanVien
const NhanVienLoginBodySchema = z.object({
	MSNV: z
		.string()
		.length(8, "Mã số nhân viên phải có 8 ký tự (VD: NV000001)."),
	Password: passwordSchema,
});

export const NhanVienLoginSchema = z.object({ body: NhanVienLoginBodySchema });
export type NhanVienLoginPayload = z.infer<typeof NhanVienLoginBodySchema>;


// DocGia
const DocGiaLoginBodySchema = z.object({
	MSDG: z
		.string()
		.length(8, "Mã số độc giả phải có 8 ký tự (VD: DG000001)."),
	Password: passwordSchema,
});

export const DocGiaLoginSchema = z.object({ body: DocGiaLoginBodySchema });
export type DocGiaLoginPayload = z.infer<typeof DocGiaLoginBodySchema>;
