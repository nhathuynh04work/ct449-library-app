import { Schema, model } from "mongoose";

const nhanVienSchema = new Schema(
	{
		MSNV: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		HoTenNV: {
			type: String,
			required: true,
		},
		Password: {
			type: String,
			required: true,
			select: false,
		},
		ChucVu: {
			type: String,
			required: true,
		},
		DiaChi: {
			type: String,
			required: true,
		},
		SoDienThoai: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const NhanVien = model("NhanVien", nhanVienSchema);
