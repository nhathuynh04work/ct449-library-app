import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

const UpdateNhaXuatBanBodySchema = z.object({
	tenNhaXuatBan: z.string().min(1).optional(),
	diaChi: z.string().min(1).optional(),
});

export const UpdateNhaXuatBanSchema = z.object({
	body: UpdateNhaXuatBanBodySchema,
	params: z.object({
		maNhaXuatBan: MaSoSchema.NXB,
	}),
});

export type UpdateNhaXuatBanPayload = z.infer<
	typeof UpdateNhaXuatBanBodySchema
>;
