import z from "zod";

const CreateDanhMucBodySchema = z.object({
	tenDanhMuc: z.string().min(1, "Tên danh mục không được để trống."),
});

export const CreateDanhMucSchema = z.object({
	body: CreateDanhMucBodySchema,
});

export type CreateDanhMucPayload = z.infer<typeof CreateDanhMucBodySchema>;
