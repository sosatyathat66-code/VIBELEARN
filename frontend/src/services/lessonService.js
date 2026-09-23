import { apiRequest } from "./apiClient.js";

export const lessonService = {
  /**
   * Fetch single lesson by slug from backend API
   */
  async fetchLessonBySlug(slug) {
    try {
      const lesson = await apiRequest(`lessons/${slug}`);
      return lesson;
    } catch (err) {
      console.warn(`[LessonService] Failed fetching lesson ${slug} from API:`, err.message);
      throw err;
    }
  },
};
