import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import { GioiTinh, type GioiTinhType } from "@/constants/gioiTinh.js";

export interface IDocGia {
	MSDG: string;
	HoLot: string;
	Ten: string;
	NgaySinh: Date;
	GioiTinh: GioiTinhType;
	DiaChi: string;
	SoDienThoai: string;
	Password: string;
}

const docGiaSchema = new Schema<IDocGia>(
	{
		MSDG: {
			type: String,
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
		GioiTinh: {
			type: String,
			required: true,
			enum: Object.values(GioiTinh),
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
		Password: {
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
		this.MSDG = `DG${sequenceNumber}`;

		next();
	} catch (error: any) {
		next(error);
	}
});

export const DocGia = model("DocGia", docGiaSchema);
