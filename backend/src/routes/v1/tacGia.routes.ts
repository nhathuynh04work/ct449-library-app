import { Router } from "express";
import * as tacGiaController from "@/controllers/tacGia.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
	CreateTacGiaSchema,
	UpdateTacGiaSchema,
} from "@/schemas/tacGia.schema.js";

const router = Router();

router.post("/", validate(CreateTacGiaSchema), tacGiaController.createTacGia);

router.get("/", tacGiaController.getAllTacGia);

router.put("/:id", validate(UpdateTacGiaSchema), tacGiaController.updateTacGia);

router.delete("/:id", tacGiaController.deleteTacGia);

export default router;
