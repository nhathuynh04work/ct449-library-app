import { createDanhMuc } from "@/controllers/danhMuc.controller.js";
import { validate } from "@/middlewares/validate-request.js";
import { CreateDanhMucSchema } from "@/schemas/danhMuc/create.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", validate(CreateDanhMucSchema), createDanhMuc);

export default router;
