import z from "zod";
import { ObjectIdSchema } from "./common.schema.js";

// Create
const CreateSachBodySchema = z.object({
	tenSach: z.string().min(1, "Tên sách không được để trống."),
	namXuatBan: z.coerce
		.number()
		.int()
		.min(1000)
		.max(new Date().getFullYear(), "Năm xuất bản không hợp lệ."),

	tacGia: z.array(ObjectIdSchema).min(1, "Sách phải có ít nhất một tác giả."),

	danhMuc: z
		.array(ObjectIdSchema)
		.min(1, "Sách phải thuộc ít nhất một danh mục."),
	nhaXuatBan: ObjectIdSchema,
});

export const CreateSachSchema = z.object({
	body: CreateSachBodySchema,
});

export type CreateSachPayload = z.infer<typeof CreateSachBodySchema>;

// Update
const UpdateSachBodySchema = z.object({
	tenSach: z.string().min(1).optional(),
	namXuatBan: z.coerce.number().int().optional(),
	tacGia: z.array(ObjectIdSchema).min(1).optional(),
	danhMuc: z.array(ObjectIdSchema).min(1).optional(),
	nhaXuatBan: ObjectIdSchema.optional(),
});

export const UpdateSachSchema = z.object({
	body: UpdateSachBodySchema,
});

export type UpdateSachPayload = z.infer<typeof UpdateSachBodySchema>;
