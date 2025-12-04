import { NotFoundException } from "@/errors/not-found.js";
import { DocGia, type IDocGia } from "@/models/DocGia.js";
import { NhanVien, type INhanVien } from "@/models/NhanVien.js";
import type {
	DocGiaLoginPayload,
	NhanVienLoginPayload,
} from "@/schemas/auth.schema.js";
import { generateToken, type TokenPayload } from "@/utils/jwt.js";
import { compare } from "bcrypt";
import type { FilterQuery, Model } from "mongoose";

interface HasPassword {
	matKhau: string;
}

type MongooseUser<T> = T & { _id: any };

export async function checkCredentials<T extends HasPassword>(params: {
	Model: Model<T>;
	identifierField: keyof T;
	identifierValue: string;
	passwordAttempt: string;
}): Promise<MongooseUser<T>> {
	const { Model, identifierField, identifierValue, passwordAttempt } = params;

	const query = {
		[identifierField]: identifierValue,
	} as FilterQuery<T>;

	const user = await Model.findOne(query).select("+matKhau");

	if (!user) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	const isMatch = await compare(passwordAttempt, user.matKhau);

	if (!isMatch) {
		throw new NotFoundException("Thông tin đăng nhập không hợp lệ.");
	}

	return user.toObject() as MongooseUser<T>;
}

export async function loginNhanVien(payload: NhanVienLoginPayload) {
	const nhanVien = await checkCredentials<INhanVien>({
		Model: NhanVien,
		identifierField: "maNhanVien",
		identifierValue: payload.maNhanVien,
		passwordAttempt: payload.matKhau,
	});

	const tokenPayload: TokenPayload = {
		_id: nhanVien._id.toString(),
		identifier: nhanVien.maNhanVien,
		role: nhanVien.chucVu,
	};

	const token = generateToken(tokenPayload);
	const { matKhau, ...user } = nhanVien;
	return { token, user };
}

export async function loginDocGia(payload: DocGiaLoginPayload) {
	const docGia = await checkCredentials<IDocGia>({
		Model: DocGia,
		identifierField: "maDocGia",
		identifierValue: payload.maDocGia,
		passwordAttempt: payload.matKhau,
	});

	const tokenPayload: TokenPayload = {
		_id: docGia._id.toString(),
		identifier: docGia.maDocGia,
		role: "READER",
	};

	const token = generateToken(tokenPayload);
	const { matKhau, ...user } = docGia;
	return { token, user };
}
