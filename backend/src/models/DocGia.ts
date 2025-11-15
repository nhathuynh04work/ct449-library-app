import { Schema, model } from "mongoose";

const docGiaSchema = new Schema(
	{
		MaDocGia: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		HoLot: {
			type: String,
			required: true,
		},
		Ten: {
			type: String,
			required: true,
		},
		NgaySinh: {
			type: Date,
			required: true,
		},
		Phai: {
			type: String,
			required: true,
			enum: ["Nam", "Nữ", "Khác"],
		},
		DiaChi: {
			type: String,
			required: true,
		},
		DienThoai: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const DocGia = model("DocGia", docGiaSchema);
