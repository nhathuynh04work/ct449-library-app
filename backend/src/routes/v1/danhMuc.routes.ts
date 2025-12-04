import * as danhMucController from "@/controllers/danhMuc.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { CreateDanhMucSchema, UpdateDanhMucSchema } from "@/schemas/danhMuc.schema.js";
import { Router } from "express";

const router = Router();

router.get("/", danhMucController.getAllDanhMuc);

router.post(
	"/",
	validate(CreateDanhMucSchema),
	danhMucController.createDanhMuc
);

router.put(
	"/:id",
	validate(UpdateDanhMucSchema),
	danhMucController.updateDanhMuc
);

router.delete(
	"/:id",
	danhMucController.deleteDanhMuc
);

export default router;
