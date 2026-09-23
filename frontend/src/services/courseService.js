import { apiRequest } from "./apiClient.js";
import { MOCK_COURSES } from "./mockData.js";

export const courseService = {
  /**
   * Fetch all courses from backend API with fallback
   */
  async fetchCourses() {
    try {
      const data = await apiRequest("courses");
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return MOCK_COURSES;
    } catch (err) {
      console.warn("[CourseService] Failed fetching courses from API, using fallback data:", err.message);
      return MOCK_COURSES;
    }
  },

  /**
   * Fetch single course by slug from backend API with fallback
   */
  async fetchCourseBySlug(slug) {
    try {
      const course = await apiRequest(`courses/${slug}`);
      if (course && course.id) {
        return course;
      }
      return MOCK_COURSES.find((c) => c.slug === slug) || MOCK_COURSES[0];
    } catch (err) {
      console.warn(`[CourseService] Failed fetching course ${slug} from API, using fallback data:`, err.message);
      return MOCK_COURSES.find((c) => c.slug === slug) || MOCK_COURSES[0];
    }
  },
};
