import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import type { ITacGia } from "./TacGia.js";
import type { IDanhMuc } from "./DanhMuc.js";
import type { INhaXuatBan } from "./NhaXuatBan.js";

export interface ISach {
	maSach: string;
	tenSach: string;
	namXuatBan: number;

	tacGia: (Schema.Types.ObjectId | ITacGia)[];
	danhMuc: Schema.Types.ObjectId | IDanhMuc;
	nhaXuatBan: Schema.Types.ObjectId | INhaXuatBan;

	createdAt?: Date;
	updatedAt?: Date;
}

const sachSchema = new Schema<ISach>(
	{
		maSach: {
			type: String,
			unique: true,
			index: true,
		},
		tenSach: {
			type: String,
			required: true,
		},
		namXuatBan: {
			type: Number,
			required: true,
		},

		tacGia: {
			type: [Schema.Types.ObjectId],
			ref: "TacGia",
			required: true,
		},

		danhMuc: {
			type: Schema.Types.ObjectId,
			ref: "DanhMuc",
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

sachSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "sachId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");
		this.maSach = `SACH${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const Sach = model("Sach", sachSchema);
