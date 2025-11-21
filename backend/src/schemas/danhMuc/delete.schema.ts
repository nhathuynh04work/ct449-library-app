import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

export const DeleteDanhMucSchema = z.object({
	params: z.object({
		maDanhMuc: MaSoSchema.DANH_MUC,
	}),
});
