import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import type { ISach } from "./Sach.js";
import {
	TrangThaiBanSao,
	type TrangThaiBanSaoType,
} from "@/constants/index.js";

export interface IBanSao {
	maBanSao: string;
	sach: Schema.Types.ObjectId | ISach;
	trangThai: TrangThaiBanSaoType;

	createdAt?: Date;
	updatedAt?: Date;
}

const banSaoSchema = new Schema<IBanSao>(
	{
		maBanSao: {
			type: String,
			unique: true,
			index: true,
		},
		sach: {
			type: Schema.Types.ObjectId,
			ref: "Sach",
			required: true,
			index: true,
		},
		trangThai: {
			type: String,
			required: true,
			enum: Object.values(TrangThaiBanSao),
			default: TrangThaiBanSao.AVAILABLE,
		},
	},
	{ timestamps: true }
);

banSaoSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "banSaoId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");
		this.maBanSao = `BS${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const BanSao = model("BanSao", banSaoSchema);
