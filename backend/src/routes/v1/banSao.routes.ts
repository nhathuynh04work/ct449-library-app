import { Router } from "express";
import * as banSaoController from "@/controllers/banSao.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
	CreateBanSaoSchema,
	UpdateBanSaoSchema,
} from "@/schemas/banSao.schema.js";

const router = Router();

router.post("/", validate(CreateBanSaoSchema), banSaoController.createBanSao);

router.get("/", banSaoController.getAllBanSao);

router.get("/:id", banSaoController.getBanSaoByMa);

router.put("/:id", validate(UpdateBanSaoSchema), banSaoController.updateBanSao);

router.delete("/:id", banSaoController.deleteBanSao);

export default router;
