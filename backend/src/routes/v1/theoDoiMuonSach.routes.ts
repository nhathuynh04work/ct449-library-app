import { Router } from "express";
import * as controller from "@/controllers/theoDoiMuonSach.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, controller.getMyHistory);
router.get("/", authenticate, controller.getAllLoans);
router.put("/:id/status", authenticate, controller.updateLoanStatus);
router.patch("/:id/cancel", authenticate, controller.cancelMyLoan); // New route

export default router;
