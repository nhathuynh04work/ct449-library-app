import z from "zod";

export const MaSoSchema = {
	DOC_GIA: z
		.string()
		.regex(/^DG\d{6}$/, "Mã độc giả không hợp lệ (VD: DG000001)."),

	NHAN_VIEN: z
		.string()
		.regex(/^NV\d{6}$/, "Mã nhân viên không hợp lệ (VD: NV000001)."),

	SACH: z
		.string()
		.regex(/^SACH\d{6}$/, "Mã sách không hợp lệ (VD: SACH001001)."),

	TAC_GIA: z
		.string()
		.regex(/^TG\d{6}$/, "Mã tác giả không hợp lệ (VD: TG001001)."),
        
	NXB: z.string().regex(/^NXB\d{6}$/, "Mã NXB không hợp lệ (VD: NXB001001)."),

	DANH_MUC: z
		.string()
		.regex(/^DM\d{6}$/, "Mã danh mục không hợp lệ (VD: DM001001)."),

	BAN_SAO: z
		.string()
		.regex(/^BS\d{6}$/, "Mã bản sao không hợp lệ (VD: BS001001)."),
};
