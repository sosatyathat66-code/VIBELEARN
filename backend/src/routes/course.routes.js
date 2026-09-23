import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";

const router = Router();

// GET /api/courses - List all courses
router.get("/", courseController.getCourses);

// GET /api/courses/:slug - Get single course details with modules and lessons
router.get("/:slug", courseController.getCourseBySlug);

export default router;
