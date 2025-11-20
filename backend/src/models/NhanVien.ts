import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import { GioiTinh, type GioiTinhType } from "@/constants/gioiTinh.js";
import { ChucVu, type ChucVuType } from "@/constants/chucVu.js";

export interface INhanVien {
	maNhanVien: string;
	hoLot: string;
	ten: string;
	ngaySinh: Date;
	gioiTinh: GioiTinhType;
	matKhau: string;
	chucVu: ChucVuType;
	diaChi: string;
	soDienThoai: string;

	createdAt?: Date;
	updatedAt?: Date;
}

const nhanVienSchema = new Schema<INhanVien>(
	{
		maNhanVien: {
			type: String,
			unique: true,
			index: true,
		},
		hoLot: { type: String, required: true },
		ten: { type: String, required: true },
		ngaySinh: { type: Date, required: true },
		gioiTinh: {
			type: String,
			required: true,
			enum: Object.values(GioiTinh),
		},
		matKhau: {
			type: String,
			required: true,
			select: false,
		},
		chucVu: {
			type: String,
			required: true,
			enum: Object.values(ChucVu),
			default: ChucVu.LIBRARIAN,
		},
		diaChi: {
			type: String,
			required: true,
		},
		soDienThoai: {
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
		this.maNhanVien = `NV${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const NhanVien = model("NhanVien", nhanVienSchema);
