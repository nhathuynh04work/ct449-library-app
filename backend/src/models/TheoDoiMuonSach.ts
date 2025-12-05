import { Schema, model } from "mongoose";
import { Counter } from "./Counter.js";
import type { IDocGia } from "./DocGia.js";
import type { IBanSao } from "./BanSao.js";

export const TrangThaiMuon = {
	DANG_CHO: "DANG_CHO", // Pending Approval
	DANG_MUON: "DANG_MUON", // Active / Approved
	DA_TRA: "DA_TRA", // Returned
	DA_TU_CHOI: "DA_TU_CHOI", // Rejected
	DA_HUY: "DA_HUY", // Cancelled by User
} as const;

export type TrangThaiMuonType =
	(typeof TrangThaiMuon)[keyof typeof TrangThaiMuon];

export interface ITheoDoiMuonSach {
	maPhieuMuon: string;
	docGia: Schema.Types.ObjectId | IDocGia;
	banSao: Schema.Types.ObjectId | IBanSao;
	ngayMuon: Date;
	ngayTra?: Date | null;
	trangThai: TrangThaiMuonType;

	createdAt?: Date;
	updatedAt?: Date;
}

const theoDoiMuonSachSchema = new Schema<ITheoDoiMuonSach>(
	{
		maPhieuMuon: {
			type: String,
			unique: true,
			index: true,
		},
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
		trangThai: {
			type: String,
			enum: Object.values(TrangThaiMuon),
			default: TrangThaiMuon.DANG_CHO,
			required: true,
		},
	},
	{ timestamps: true }
);

theoDoiMuonSachSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		const counter = await Counter.findByIdAndUpdate(
			{ _id: "theoDoiMuonSachId" },
			{ $inc: { sequence_value: 1 } },
			{ new: true, upsert: true }
		);

		const sequenceNumber = String(counter.sequence_value).padStart(6, "0");
		this.maPhieuMuon = `MP${sequenceNumber}`;
		next();
	} catch (error: any) {
		next(error);
	}
});

export const TheoDoiMuonSach = model<ITheoDoiMuonSach>(
	"TheoDoiMuonSach",
	theoDoiMuonSachSchema
);
