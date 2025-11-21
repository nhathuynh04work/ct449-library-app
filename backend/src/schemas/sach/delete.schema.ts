import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

export const DeleteSachSchema = z.object({
	params: z.object({
		maSach: MaSoSchema.SACH,
	}),
});
