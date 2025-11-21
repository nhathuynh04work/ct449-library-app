import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";

export interface IDanhMuc {
	maDanhMuc: string;
	tenDanhMuc: string;
    
	createdAt?: Date;
	updatedAt?: Date;
}

const danhMucSchema = new Schema<IDanhMuc>(
	{
		maDanhMuc: {
			type: String,
			unique: true,
			index: true,
		},
		tenDanhMuc: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

danhMucSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "danhMucId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");

		this.maDanhMuc = `DM${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const DanhMuc = model("DanhMuc", danhMucSchema);
