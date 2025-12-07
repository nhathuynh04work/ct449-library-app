import {
	registerDocGia,
	getAllDocGia,
	toggleBlock,
} from "@/controllers/docGia.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { RegisterDocGiaSchema } from "@/schemas/docGia.schema.js";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, getAllDocGia);
router.post("/", validate(RegisterDocGiaSchema), registerDocGia);
router.patch("/:id/block", authenticate, toggleBlock);

export default router;
