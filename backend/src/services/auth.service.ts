import { NotFoundException } from "@/errors/not-found.js";
import { DocGia } from "@/models/DocGia.js";
import { NhanVien } from "@/models/NhanVien.js";
import type {
	DocGiaLoginPayload,
	NhanVienLoginPayload,
} from "@/schemas/auth/login.schema.js";
import { generateToken, type TokenPayload } from "@/utils/jwt.js";
import { compare } from "bcrypt";
import type { Model } from "mongoose";

export async function checkCredentials(params: {
	Model: Model<any>;
	identifierField: string;
	identifierValue: string;
	passwordAttempt: string;
}) {
	const { Model, identifierField, identifierValue, passwordAttempt } = params;

	const query: Record<string, string> = {};
	query[identifierField] = identifierValue;

	const user = await Model.findOne(query).select("+matKhau");

	if (!user) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	const isMatch = await compare(passwordAttempt, user.matKhau);

	if (!isMatch) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	return user.toObject();
}

export async function loginNhanVien(payload: NhanVienLoginPayload) {
	const nhanVien = await checkCredentials({
		Model: NhanVien,
		identifierField: "maNhanVien",
		identifierValue: payload.maNhanVien,
		passwordAttempt: payload.matKhau,
	});

	const tokenPayload: TokenPayload = {
		_id: nhanVien._id,
		identifier: nhanVien.maNhanVien,
		role: nhanVien.chucVu,
	};

	const token = generateToken(tokenPayload);
	return { token, maNhanVien: nhanVien.maNhanVien };
}

export async function loginDocGia(payload: DocGiaLoginPayload) {
	const docGia = await checkCredentials({
		Model: DocGia,
		identifierField: "maDocGia",
		identifierValue: payload.maDocGia,
		passwordAttempt: payload.matKhau,
	});

	const tokenPayload: TokenPayload = {
		_id: docGia._id,
		identifier: docGia.maDocGia,
		role: "READER",
	};

	const token = generateToken(tokenPayload);
	return { token, maDocGia: docGia.maDocGia };
}
