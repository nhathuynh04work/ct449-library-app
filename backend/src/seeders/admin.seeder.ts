import { ChucVu, GioiTinh } from "@/constants/index.js";
import { NhanVien } from "@/models/NhanVien.js";
import type { RegisterNhanVienPayload } from "@/schemas/nhanVien.schema.js";
import logger from "@/utils/logger.js";
import { hash } from "bcrypt";
import "dotenv/config";

const DEFAULT_PHONE_CHECK = "9999999999";
const DEFAULT_PASSWORD = "AdminPassword123";
const DEFAULT_HO_LOT = "Quản Trị";
const DEFAULT_TEN = "Hệ Thống";

export async function seedAdmin() {
	const existing = await NhanVien.findOne({
		soDienThoai: DEFAULT_PHONE_CHECK,
	});

	if (existing) {
		logger.warn("Admin user already exists. Skip seeding.");
		return;
	}

	const hashedPassword = await hash(DEFAULT_PASSWORD, 10);

	const payload: RegisterNhanVienPayload = {
		hoLot: DEFAULT_HO_LOT,
		ten: DEFAULT_TEN,
		ngaySinh: new Date("2004-06-15"),
		gioiTinh: GioiTinh.NAM,
		matKhau: hashedPassword,
		diaChi: "9999 Central Admin Address",
		soDienThoai: DEFAULT_PHONE_CHECK,
		chucVu: ChucVu.ADMIN,
	};

	try {
		const newAdmin = new NhanVien(payload);
		await newAdmin.save();
		logger.info(`Admin account created! MSNV: ${newAdmin.maNhanVien}`);
	} catch (e) {
		logger.error(e, "Failed to seed admin user.");
	}
}
