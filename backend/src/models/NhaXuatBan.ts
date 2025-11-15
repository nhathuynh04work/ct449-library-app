import { Schema, model } from "mongoose";

const nhaXuatBanSchema = new Schema(
	{
		MaNXB: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		TenNXB: {
			type: String,
			required: true,
		},
		DiaChi: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const NhaXuatBan = model("NhaXuatBan", nhaXuatBanSchema);
