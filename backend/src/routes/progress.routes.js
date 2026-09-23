import { Router } from "express";
import { progressController } from "../controllers/progress.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Enforce authentication on all progress endpoints
router.use(requireAuth);

// GET /api/progress - Get learner progress
router.get("/", progressController.getProgress);

// POST /api/progress - Save or update learner progress
router.post("/", progressController.saveProgress);

export default router;
