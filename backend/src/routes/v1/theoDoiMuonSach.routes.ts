import { Router } from "express";
import * as controller from "@/controllers/theoDoiMuonSach.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";

const router = Router();

// Only logged in users can see their history
router.get("/me", authenticate, controller.getMyHistory);

router.get("/", authenticate, controller.getAllLoans); // Should add role check ideally
router.put("/:id/status", authenticate, controller.updateLoanStatus);

export default router;
