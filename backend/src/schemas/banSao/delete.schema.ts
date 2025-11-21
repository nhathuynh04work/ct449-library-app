import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

export const DeleteBanSaoSchema = z.object({
	params: z.object({
		maBanSao: MaSoSchema.BAN_SAO,
	}),
});
