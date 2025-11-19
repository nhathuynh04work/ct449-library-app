import { NotFoundException } from "@/errors/not-found.js";
import { DocGia } from "@/models/DocGia.js";
import { NhanVien } from "@/models/NhanVien.js";
import type {
	DocGiaLoginPayload,
	NhanVienLoginPayload,
} from "@/schemas/auth/login.schema.js";
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
	return checkCredentials({
		Model: NhanVien,
		identifierField: "MSNV",
		identifierValue: payload.MSNV,
		passwordAttempt: payload.Password,
	});
}

export async function loginDocGia(payload: DocGiaLoginPayload) {
	return checkCredentials({
		Model: DocGia,
		identifierField: "MSDG",
		identifierValue: payload.MSDG,
		passwordAttempt: payload.Password,
	});
}
