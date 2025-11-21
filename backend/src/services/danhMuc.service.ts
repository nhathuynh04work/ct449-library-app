import { ErrorCode } from "@/constants/errorCode.js";
import { ConflictException } from "@/errors/conflict.js";
import { DanhMuc } from "@/models/DanhMuc.js";
import type { CreateDanhMucPayload } from "@/schemas/danhMuc/create.schema.js";

export async function createDanhMuc(payload: CreateDanhMucPayload) {
	try {
		const savedDanhMuc = await DanhMuc.create(payload);
		return savedDanhMuc.toObject();
	} catch (error: any) {
		if (error.code === ErrorCode.MONGOOSE_DUPLICATE) {
			throw new ConflictException("Danh mục này đã tồn tại.");
		}
		throw error;
	}
}
