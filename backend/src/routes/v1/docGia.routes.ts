import { registerDocGia } from "@/controllers/docGia.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { RegisterDocGiaSchema } from "@/schemas/docGia/register.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", validate(RegisterDocGiaSchema), registerDocGia);

export default router;
