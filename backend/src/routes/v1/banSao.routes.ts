import { Router } from "express";
import * as banSaoController from "@/controllers/banSao.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

import { CreateBanSaoSchema } from "@/schemas/banSao/create.schema.js";
import { UpdateBanSaoSchema } from "@/schemas/banSao/update.schema.js";
import { DeleteBanSaoSchema } from "@/schemas/banSao/delete.schema.js";

const router = Router();

router.post("/", validate(CreateBanSaoSchema), banSaoController.createBanSao);

router.get("/", banSaoController.getAllBanSao);

router.get("/:maBanSao", banSaoController.getBanSaoByMa);

router.put(
	"/:maBanSao",
	validate(UpdateBanSaoSchema),
	banSaoController.updateBanSao
);

router.delete(
	"/:maBanSao",
	validate(DeleteBanSaoSchema),
	banSaoController.deleteBanSao
);

export default router;
