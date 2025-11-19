import { registerDocGia } from "@/controllers/docGia.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { CreateDocGiaSchema } from "@/schemas/docGia.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", validate(CreateDocGiaSchema), registerDocGia);

export default router;
