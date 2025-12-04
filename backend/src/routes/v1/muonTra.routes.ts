import { Router } from "express";
import * as muonTraController from "@/controllers/muonTra.controller.js";
import { MuonSachSchema } from "@/schemas/muonTra/muon.schema.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router = Router();

router.post(
	"/muon",
	authenticate,
	validate(MuonSachSchema),
	muonTraController.muonSach
);

export default router;
