import z from "zod";

// Create
const CreateDanhMucBodySchema = z.object({
	tenDanhMuc: z.string().min(1, "Tên danh mục không được để trống."),
});

export const CreateDanhMucSchema = z.object({
	body: CreateDanhMucBodySchema,
});

export type CreateDanhMucPayload = z.infer<typeof CreateDanhMucBodySchema>;

// Update
const UpdateDanhMucBodySchema = z.object({
	tenDanhMuc: z.string().min(1, "Tên danh mục không được để trống."),
});

export const UpdateDanhMucSchema = z.object({
	body: UpdateDanhMucBodySchema,
});

export type UpdateDanhMucPayload = z.infer<typeof UpdateDanhMucBodySchema>;
