import z from "zod";
import { MaSoSchema } from "../common/maSo.schema.js";

const MuonSachBodySchema = z.object({
	maSach: MaSoSchema.SACH,
});

export const MuonSachSchema = z.object({
	body: MuonSachBodySchema,
});

export type MuonSachPayload = z.infer<typeof MuonSachBodySchema>;
