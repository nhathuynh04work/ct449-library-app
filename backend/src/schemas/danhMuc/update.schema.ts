import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

const UpdateDanhMucBodySchema = z.object({
	tenDanhMuc: z.string().min(1, "Tên danh mục không được để trống."),
});

export const UpdateDanhMucSchema = z.object({
	body: UpdateDanhMucBodySchema,
	params: z.object({ maDanhMuc: MaSoSchema.DANH_MUC }),
});

export type UpdateDanhMucPayload = z.infer<typeof UpdateDanhMucBodySchema>;
