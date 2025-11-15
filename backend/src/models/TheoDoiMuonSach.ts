import { Schema, model } from "mongoose";

const theoDoiMuonSachSchema = new Schema(
	{
		docGia: {
			type: Schema.Types.ObjectId,
			ref: "DocGia",
			required: true,
			index: true,
		},
		sach: {
			type: Schema.Types.ObjectId,
			ref: "Sach",
			required: true,
			index: true,
		},
		NgayMuon: {
			type: Date,
			required: true,
			default: Date.now,
		},
		NgayTra: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

export const TheoDoiMuonSach = model("TheoDoiMuonSach", theoDoiMuonSachSchema);
