import { ChucVuNhanVien, NhanVien } from "@/models/NhanVien.js";
import logger from "@/utils/logger.js";
import { hash } from "bcrypt";
import "dotenv/config";

const username = process.env.DEFAULT_ADMIN_USERNAME || "ADMIN_MASTER";
const password = process.env.DEFAULT_ADMIN_PASSWORD || "12345678";

export async function seedAdmin() {
	const existing = await NhanVien.findOne({ HoTenNV: username });

	if (existing) {
		logger.warn("Admin user already exists. Skip seeding");
		return;
	}

	const hashed = await hash(password, 10);
	const payload = {
		HoTenNV: username,
		Password: hashed,
		ChucVu: ChucVuNhanVien.ADMIN,
		DiaChi: "Headquarters",
		SoDienThoai: "99999999999",
	};

	const newAdmin = new NhanVien(payload);
	await newAdmin.save();

	logger.info(`Admin account with username ${username} seeded successfully.`);
}
