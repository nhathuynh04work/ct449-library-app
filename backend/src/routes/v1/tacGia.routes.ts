import { Router } from "express";
import * as tacGiaController from "@/controllers/tacGia.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

import { CreateTacGiaSchema } from "@/schemas/tacGia/create.schema.js";
import { UpdateTacGiaSchema } from "@/schemas/tacGia/update.schema.js";
import { DeleteTacGiaSchema } from "@/schemas/tacGia/delete.schema.js";

const router = Router();

router.post("/", validate(CreateTacGiaSchema), tacGiaController.createTacGia);

router.get("/", tacGiaController.getAllTacGia);

router.put(
	"/:maTacGia",
	validate(UpdateTacGiaSchema),
	tacGiaController.updateTacGia
);

router.delete(
	"/:maTacGia",
	validate(DeleteTacGiaSchema),
	tacGiaController.deleteTacGia
);

export default router;
