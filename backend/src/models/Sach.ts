import { Schema, model } from "mongoose";

const sachSchema = new Schema(
	{
		MaSach: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		TenSach: {
			type: String,
			required: true,
		},
		DonGia: {
			type: Number,
			required: true,
		},
		SoQuyen: {
			type: Number,
			required: true,
			min: 0,
		},
		NamXuatBan: {
			type: Number,
			required: true,
		},
		TacGia: {
			type: String,
			required: true,
		},
		nhaXuatBan: {
			type: Schema.Types.ObjectId,
			ref: "NhaXuatBan",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Sach = model("Sach", sachSchema);
