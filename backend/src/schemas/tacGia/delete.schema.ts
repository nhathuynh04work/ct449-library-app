import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

export const DeleteTacGiaSchema = z.object({
	params: z.object({
		maTacGia: MaSoSchema.TAC_GIA,
	}),
});
