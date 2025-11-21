import { Router } from "express";
import * as nhaXuatBanController from "@/controllers/nhaXuatBan.controller.js";
import { validate } from "@/middlewares/validate-request.js";

import { CreateNhaXuatBanSchema } from "@/schemas/nhaXuatBan/create.schema.js";
import { UpdateNhaXuatBanSchema } from "@/schemas/nhaXuatBan/update.schema.js";
import { DeleteNhaXuatBanSchema } from "@/schemas/nhaXuatBan/delete.schema.js";

const router = Router();

router.post(
	"/",
	validate(CreateNhaXuatBanSchema),
	nhaXuatBanController.createNhaXuatBan
);

router.get("/", nhaXuatBanController.getAllNhaXuatBan);

router.put(
	"/:maNhaXuatBan",
	validate(UpdateNhaXuatBanSchema),
	nhaXuatBanController.updateNhaXuatBan
);

router.delete(
	"/:maNhaXuatBan",
	validate(DeleteNhaXuatBanSchema),
	nhaXuatBanController.deleteNhaXuatBan
);

export default router;
