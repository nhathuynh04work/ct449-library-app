import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

export const DeleteNhaXuatBanSchema = z.object({
	params: z.object({
		maNhaXuatBan: MaSoSchema.NXB,
	}),
});
