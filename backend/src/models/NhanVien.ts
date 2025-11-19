import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import { GioiTinh, type GioiTinhType } from "@/constants/gioiTinh.js";
import { ChucVu, type ChucVuType } from "@/constants/chucVu.js";

export interface INhanVien {
	MSNV: string;
	HoLot: string;
	Ten: string;
	NgaySinh: Date;
	GioiTinh: GioiTinhType;
	Password: string;
	ChucVu: ChucVuType;
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
		HoLot: { type: String, required: true },
		Ten: { type: String, required: true },
		NgaySinh: { type: Date, required: true },
		GioiTinh: {
			type: String,
			required: true,
			enum: Object.values(GioiTinh),
		},
		Password: {
			type: String,
			required: true,
			select: false,
		},
		ChucVu: {
			type: String,
			required: true,
			enum: Object.values(ChucVu),
			default: ChucVu.LIBRARIAN,
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

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");
		this.MSNV = `NV${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const NhanVien = model("NhanVien", nhanVienSchema);
