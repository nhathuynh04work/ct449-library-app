import z from "zod";

const passwordSchema = z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự.");

// NhanVien
const NhanVienLoginBodySchema = z.object({
	maNhanVien: z
		.string()
		.length(8, "Mã số nhân viên phải có 8 ký tự (VD: NV000001)."),
	matKhau: passwordSchema,
});

export const NhanVienLoginSchema = z.object({ body: NhanVienLoginBodySchema });
export type NhanVienLoginPayload = z.infer<typeof NhanVienLoginBodySchema>;

// DocGia
const DocGiaLoginBodySchema = z.object({
	maDocGia: z
		.string()
		.length(8, "Mã số độc giả phải có 8 ký tự (VD: DG000001)."),
	matKhau: passwordSchema,
});

export const DocGiaLoginSchema = z.object({ body: DocGiaLoginBodySchema });
export type DocGiaLoginPayload = z.infer<typeof DocGiaLoginBodySchema>;
