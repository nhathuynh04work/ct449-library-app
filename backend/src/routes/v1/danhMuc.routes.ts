import * as danhMucController from "@/controllers/danhMuc.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { CreateDanhMucSchema } from "@/schemas/danhMuc/create.schema.js";
import { DeleteDanhMucSchema } from "@/schemas/danhMuc/delete.schema.js";
import { UpdateDanhMucSchema } from "@/schemas/danhMuc/update.schema.js";
import { Router } from "express";

const router = Router();

router.get("/", danhMucController.getAllDanhMuc);

router.post(
	"/",
	validate(CreateDanhMucSchema),
	danhMucController.createDanhMuc
);

router.put(
	"/:maDanhMuc",
	validate(UpdateDanhMucSchema),
	danhMucController.updateDanhMuc
);

router.delete(
	"/:maDanhMuc",
	validate(DeleteDanhMucSchema),
	danhMucController.deleteDanhMuc
);

export default router;
