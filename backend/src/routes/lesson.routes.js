import { Router } from "express";
import { lessonController } from "../controllers/lesson.controller.js";

const router = Router();

// GET /api/lessons/:slug - Get single lesson details with notes and video
router.get("/:slug", lessonController.getLessonBySlug);

export default router;
