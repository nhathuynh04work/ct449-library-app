import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";

export enum ChucVuNhanVien {
	LIBRARIAN = "LIBRARIAN",
	ADMIN = "ADMIN",
}

export interface INhanVien {
	MSNV: string;
	HoTenNV: string;
	Password: string;
	ChucVu: ChucVuNhanVien;
	DiaChi: string;
	SoDienThoai: string;
}

const nhanVienSchema = new Schema<INhanVien>(
	{
		MSNV: {
			type: String,
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
			enum: Object.values(ChucVuNhanVien),
			default: ChucVuNhanVien.LIBRARIAN,
		},
		DiaChi: {
			type: String,
			required: true,
		},
		SoDienThoai: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

nhanVienSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "nhanVienId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		this.MSNV = `NV${counter.sequence_value}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const NhanVien = model("NhanVien", nhanVienSchema);
