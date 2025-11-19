import { ChucVu, GioiTinh } from "@/constants/index.js";
import { NhanVien } from "@/models/NhanVien.js";
import type { RegisterNhanVienPayload } from "@/schemas/nhanVien/register.schema.js";
import logger from "@/utils/logger.js";
import { hash } from "bcrypt";
import "dotenv/config";

const DEFAULT_PHONE_CHECK = "9999999999";
const DEFAULT_PASSWORD = "AdminPassword123";
const DEFAULT_HO_LOT = "Quản Trị";
const DEFAULT_TEN = "Hệ Thống";

export async function seedAdmin() {
	const existing = await NhanVien.findOne({
		SoDienThoai: DEFAULT_PHONE_CHECK,
	});

	if (existing) {
		logger.warn("Admin user already exists. Skip seeding.");
		return;
	}

	const hashedPassword = await hash(DEFAULT_PASSWORD, 10);

	const payload: RegisterNhanVienPayload = {
		HoLot: DEFAULT_HO_LOT,
		Ten: DEFAULT_TEN,
		NgaySinh: new Date("2004-06-15"),
		GioiTinh: GioiTinh.NAM,
		Password: hashedPassword,
		DiaChi: "9999 Central Admin Address",
		SoDienThoai: DEFAULT_PHONE_CHECK,
		ChucVu: ChucVu.ADMIN,
	};

	try {
		const newAdmin = new NhanVien(payload);
		await newAdmin.save();
		logger.info(`Admin account created! MSNV: ${newAdmin.MSNV}`);
	} catch (e) {
		logger.error(e, "Failed to seed admin user.");
	}
}
