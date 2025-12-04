import z from "zod";
import { ObjectIdSchema } from "./common.schema.js";

// Create
const CreateTacGiaBodySchema = z.object({
	tenTacGia: z.string().min(1, "Tên tác giả không được để trống."),
	tieuSu: z.string().optional(),
});

export const CreateTacGiaSchema = z.object({
	body: CreateTacGiaBodySchema,
});

export type CreateTacGiaPayload = z.infer<typeof CreateTacGiaBodySchema>;

// Update
const UpdateTacGiaBodySchema = z.object({
	tenTacGia: z.string().min(1, "Tên tác giả không được để trống.").optional(),
	tieuSu: z.string().optional(),
});

export const UpdateTacGiaSchema = z.object({
	body: UpdateTacGiaBodySchema,
});

export type UpdateTacGiaPayload = z.infer<typeof UpdateTacGiaBodySchema>;
