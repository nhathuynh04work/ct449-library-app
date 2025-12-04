import { Router } from "express";
import * as nhaXuatBanController from "@/controllers/nhaXuatBan.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

import { CreateNhaXuatBanSchema, UpdateNhaXuatBanSchema } from "@/schemas/nhaXuatBan.schema.js";

const router = Router();

router.post(
	"/",
	validate(CreateNhaXuatBanSchema),
	nhaXuatBanController.createNhaXuatBan
);

router.get("/", nhaXuatBanController.getAllNhaXuatBan);

router.put(
	"/:id",
	validate(UpdateNhaXuatBanSchema),
	nhaXuatBanController.updateNhaXuatBan
);

router.delete(
	"/:id",
	nhaXuatBanController.deleteNhaXuatBan
);

export default router;
