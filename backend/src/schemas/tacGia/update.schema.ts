import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

const UpdateTacGiaBodySchema = z.object({
	tenTacGia: z.string().min(1, "Tên tác giả không được để trống.").optional(),
	tieuSu: z.string().optional(),
});

export const UpdateTacGiaSchema = z.object({
	body: UpdateTacGiaBodySchema,
	params: z.object({ maTacGia: MaSoSchema.TAC_GIA }),
});

export type UpdateTacGiaPayload = z.infer<typeof UpdateTacGiaBodySchema>;
