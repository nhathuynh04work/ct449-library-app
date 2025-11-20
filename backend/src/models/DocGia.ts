import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import { GioiTinh, type GioiTinhType } from "@/constants/gioiTinh.js";

export interface IDocGia {
	maDocGia: string;
	hoLot: string;
	ten: string;
	ngaySinh: Date;
	gioiTinh: GioiTinhType;
	matKhau: string;
	diaChi: string;
	soDienThoai: string;

	createdAt?: Date;
	updatedAt?: Date;
}

const docGiaSchema = new Schema<IDocGia>(
	{
		maDocGia: {
			type: String,
			unique: true,
			index: true,
		},
		hoLot: {
			type: String,
			required: true,
		},
		ten: {
			type: String,
			required: true,
		},
		ngaySinh: {
			type: Date,
			required: true,
		},
		gioiTinh: {
			type: String,
			required: true,
			enum: Object.values(GioiTinh),
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
		matKhau: {
			type: String,
			required: true,
			select: false,
		},
	},
	{ timestamps: true }
);

docGiaSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "docGiaId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");
		this.maDocGia = `DG${sequenceNumber}`;

		next();
	} catch (error: any) {
		next(error);
	}
});

export const DocGia = model("DocGia", docGiaSchema);
