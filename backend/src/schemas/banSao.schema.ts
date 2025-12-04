import { TrangThaiBanSao } from "@/constants/index.js";
import z from "zod";
import { ObjectIdSchema } from "./common.schema.js";

// Create
const CreateBanSaoBodySchema = z.object({
	sach: ObjectIdSchema,
	trangThai: z
		.enum(Object.values(TrangThaiBanSao) as [string, ...string[]])
		.optional()
		.default(TrangThaiBanSao.AVAILABLE),
});

export const CreateBanSaoSchema = z.object({
	body: CreateBanSaoBodySchema,
});

export type CreateBanSaoPayload = z.infer<typeof CreateBanSaoBodySchema>;

// Update
const UpdateBanSaoBodySchema = z.object({
	trangThai: z
		.enum(Object.values(TrangThaiBanSao) as [string, ...string[]])
		.optional(),
});

export const UpdateBanSaoSchema = z.object({
	body: UpdateBanSaoBodySchema,
});

export type UpdateBanSaoPayload = z.infer<typeof UpdateBanSaoBodySchema>;
