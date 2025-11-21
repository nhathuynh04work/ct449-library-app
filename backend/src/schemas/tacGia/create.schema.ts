import z from "zod";

const CreateTacGiaBodySchema = z.object({
	tenTacGia: z.string().min(1, "Tên tác giả không được để trống."),
	tieuSu: z.string().optional(),
});

export const CreateTacGiaSchema = z.object({
	body: CreateTacGiaBodySchema,
});

export type CreateTacGiaPayload = z.infer<typeof CreateTacGiaBodySchema>;
