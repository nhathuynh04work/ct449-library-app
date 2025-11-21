import z from "zod";
import { ObjectIdSchema } from "../common/objectId.schema.js";
import { MaSoSchema } from "../common/maSo.schema.js";

const UpdateSachBodySchema = z.object({
	tenSach: z.string().min(1).optional(),
	namXuatBan: z.coerce.number().int().optional(),
	tacGia: z.array(ObjectIdSchema).min(1).optional(),
	danhMuc: ObjectIdSchema.optional(),
	nhaXuatBan: ObjectIdSchema.optional(),
});

export const UpdateSachSchema = z.object({
	body: UpdateSachBodySchema,
	params: z.object({ maSach: MaSoSchema.SACH }),
});

export type UpdateSachPayload = z.infer<typeof UpdateSachBodySchema>;
