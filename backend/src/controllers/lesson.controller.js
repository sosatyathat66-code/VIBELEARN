import { lessonService } from "../services/lesson.service.js";

export const lessonController = {
  /**
   * GET /api/lessons/:slug
   */
  async getLessonBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const lesson = await lessonService.getLessonBySlug(slug);
      return res.status(200).json(lesson);
    } catch (error) {
      next(error);
    }
  },
};
