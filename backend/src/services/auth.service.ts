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

	const user = await Model.findOne(query).select("+Password");

	if (!user) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	const isMatch = await compare(passwordAttempt, user.Password);

	if (!isMatch) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	return user.toObject();
}

export async function loginNhanVien(payload: NhanVienLoginPayload) {
	const nhanVien = await checkCredentials({
		Model: NhanVien,
		identifierField: "MSNV",
		identifierValue: payload.MSNV,
		passwordAttempt: payload.Password,
	});

	const tokenPayload: TokenPayload = {
		_id: nhanVien._id,
		identifier: nhanVien.MSNV,
		role: nhanVien.ChucVu,
	};

	const token = generateToken(tokenPayload);
	return { token, MSNV: nhanVien.MSNV };
}

export async function loginDocGia(payload: DocGiaLoginPayload) {
	const docGia = await checkCredentials({
		Model: DocGia,
		identifierField: "MSDG",
		identifierValue: payload.MSDG,
		passwordAttempt: payload.Password,
	});

	const tokenPayload: TokenPayload = {
		_id: docGia._id,
		identifier: docGia.MSDG,
		role: "READER",
	};

	const token = generateToken(tokenPayload);
	return { token, MSDG: docGia.MSDG };
}
