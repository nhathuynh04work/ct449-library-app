import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";

export interface ITacGia {
	maTacGia: string;
	tenTacGia: string;
	tieuSu?: string;
    
	createdAt?: Date;
	updatedAt?: Date;
}

const tacGiaSchema = new Schema<ITacGia>(
	{
		maTacGia: {
			type: String,
			unique: true,
			index: true,
		},
		tenTacGia: {
			type: String,
			required: true,
			unique: true,
		},
		tieuSu: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

tacGiaSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "tacGiaId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");

		this.maTacGia = `TG${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const TacGia = model("TacGia", tacGiaSchema);
