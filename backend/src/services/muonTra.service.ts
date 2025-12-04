import { TrangThaiBanSao } from "@/constants/index.js";
import { ConflictException } from "@/errors/conflict.js";
import { NotFoundException } from "@/errors/not-found.js";
import { BanSao } from "@/models/BanSao.js";
import { DocGia } from "@/models/DocGia.js";
import { Sach } from "@/models/Sach.js";
import { TheoDoiMuonSach } from "@/models/TheoDoiMuonSach.js";
import type { MuonSachPayload } from "@/schemas/muonTra/muon.schema.js";
import mongoose from "mongoose";

export async function muonSach(maDocGia: string, payload: MuonSachPayload) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const docGia = await DocGia.findOne({
			maDocGia: maDocGia,
		}).session(session);

		if (!docGia) {
			throw new NotFoundException("Không tìm thấy độc giả.");
		}

		const sach = await Sach.findOne({ maSach: payload.maSach }).session(
			session
		);
        
		if (!sach) {
			throw new NotFoundException("Không tìm thấy sách.");
		}

		const banSao = await BanSao.findOneAndUpdate(
			{
				sach: sach._id,
				trangThai: TrangThaiBanSao.AVAILABLE,
			},
			{
				trangThai: TrangThaiBanSao.BORROWED,
			},
			{ new: true, session: session }
		);

		if (!banSao) {
			throw new ConflictException(
				"Sách này hiện đã hết bản sao có sẵn để mượn."
			);
		}

		const phieuMuon = new TheoDoiMuonSach({
			docGia: docGia._id,
			banSao: banSao._id,
			ngayMuon: new Date(),
		});

		await phieuMuon.save({ session });

		await session.commitTransaction();

		return {
			...phieuMuon.toObject(),
			maBanSao: banSao.maBanSao,
		};
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}
