import { Schema, model } from "mongoose";
import type { IDocGia } from "./DocGia.js";
import type { IBanSao } from "./BanSao.js";

export interface ITheoDoiMuonSach {
	docGia: Schema.Types.ObjectId | IDocGia;
	banSao: Schema.Types.ObjectId | IBanSao;
	ngayMuon: Date;
	ngayTra?: Date | null;

	createdAt?: Date;
	updatedAt?: Date;
}

const theoDoiMuonSachSchema = new Schema<ITheoDoiMuonSach>(
	{
		docGia: {
			type: Schema.Types.ObjectId,
			ref: "DocGia",
			required: true,
			index: true,
		},
		banSao: {
			type: Schema.Types.ObjectId,
			ref: "BanSao",
			required: true,
			index: true,
		},
		ngayMuon: {
			type: Date,
			required: true,
			default: Date.now,
		},
		ngayTra: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

export const TheoDoiMuonSach = model<ITheoDoiMuonSach>(
	"TheoDoiMuonSach",
	theoDoiMuonSachSchema
);
