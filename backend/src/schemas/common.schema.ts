import z from "zod";

export const ObjectIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ.");
