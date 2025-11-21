import { Router } from "express";
import * as sachController from "@/controllers/sach.controller.js";
import { validate } from "@/middlewares/validate-request.js";

import { CreateSachSchema } from "@/schemas/sach/create.schema.js";
import { UpdateSachSchema } from "@/schemas/sach/update.schema.js";
import { DeleteSachSchema } from "@/schemas/sach/delete.schema.js";

const router = Router();

router.post("/", validate(CreateSachSchema), sachController.createSach);

router.get("/", sachController.getAllSach);

router.get("/:maSach", sachController.getSachByMa);

router.put("/:maSach", validate(UpdateSachSchema), sachController.updateSach);

router.delete(
	"/:maSach",
	validate(DeleteSachSchema),
	sachController.deleteSach
);

export default router;
