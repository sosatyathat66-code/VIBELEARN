import { courseService } from "../services/course.service.js";

export const courseController = {
  /**
   * GET /api/courses
   */
  async getCourses(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      return res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/courses/:slug
   */
  async getCourseBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const course = await courseService.getCourseBySlug(slug);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },
};
