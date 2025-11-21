import z from "zod";
import { ObjectIdSchema } from "../common/objectId.schema.js";

const CreateSachBodySchema = z.object({
	tenSach: z.string().min(1, "Tên sách không được để trống."),
	namXuatBan: z.coerce
		.number()
		.int()
		.min(1000)
		.max(new Date().getFullYear(), "Năm xuất bản không hợp lệ."),

	tacGia: z.array(ObjectIdSchema).min(1, "Sách phải có ít nhất một tác giả."),

	danhMuc: ObjectIdSchema,
	nhaXuatBan: ObjectIdSchema,
});

export const CreateSachSchema = z.object({
	body: CreateSachBodySchema,
});

export type CreateSachPayload = z.infer<typeof CreateSachBodySchema>;
