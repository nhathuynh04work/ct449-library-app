import z from "zod";

const CreateNhaXuatBanBodySchema = z.object({
	tenNhaXuatBan: z.string().min(1, "Tên nhà xuất bản không được để trống."),
	diaChi: z.string().min(1, "Địa chỉ không được để trống."),
});

export const CreateNhaXuatBanSchema = z.object({
	body: CreateNhaXuatBanBodySchema,
});

export type CreateNhaXuatBanPayload = z.infer<
	typeof CreateNhaXuatBanBodySchema
>;
