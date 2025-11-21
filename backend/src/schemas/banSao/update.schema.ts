import { TrangThaiBanSao } from "@/constants/index.js";
import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

const UpdateBanSaoBodySchema = z.object({
	trangThai: z
		.enum(Object.values(TrangThaiBanSao) as [string, ...string[]])
		.optional(),
});

export const UpdateBanSaoSchema = z.object({
	body: UpdateBanSaoBodySchema,
	params: z.object({
		maBanSao: MaSoSchema.BAN_SAO,
	}),
});

export type UpdateBanSaoPayload = z.infer<typeof UpdateBanSaoBodySchema>;
