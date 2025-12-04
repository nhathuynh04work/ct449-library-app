import { Router } from "express";
import * as sachController from "@/controllers/sach.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

import { CreateSachSchema, UpdateSachSchema } from "@/schemas/sach.schema.js";

const router = Router();

router.post("/", validate(CreateSachSchema), sachController.createSach);

router.get("/", sachController.getAllSach);

router.get("/:id", sachController.getSachByMa);

router.put("/:id", validate(UpdateSachSchema), sachController.updateSach);

router.delete("/:id", sachController.deleteSach);

router.post("/:id/muon", )

export default router;
