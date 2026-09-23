import { progressRepository } from "../repositories/progress.repository.js";

export const progressService = {
  /**
   * Get progress for a specific user
   */
  async getUserProgress(userId) {
    if (!userId) {
      const err = new Error("User ID is required to fetch progress");
      err.statusCode = 401;
      throw err;
    }

    const records = await progressRepository.findByUser(userId);

    const completedCount = records.filter((r) => r.isCompleted).length;

    return {
      userId,
      totalTracked: records.length,
      completedCount,
      progress: records.map((r) => ({
        id: r.id,
        lessonId: r.lessonId,
        isCompleted: r.isCompleted,
        resumeTimestamp: r.resumeTimestamp,
        updatedAt: r.updatedAt,
        lesson: r.lesson
          ? {
              id: r.lesson.id,
              title: r.lesson.title,
              slug: r.lesson.slug,
              duration: r.lesson.duration,
            }
          : null,
      })),
    };
  },

  /**
   * Save or update progress for a user on a lesson
   */
  async saveUserProgress(userId, payload) {
    if (!userId) {
      const err = new Error("User ID is required");
      err.statusCode = 401;
      throw err;
    }

    const { lessonId, isCompleted, resumeTimestamp } = payload || {};

    if (!lessonId) {
      const err = new Error("lessonId is required in progress payload");
      err.statusCode = 400;
      throw err;
    }

    const cleanCompleted = typeof isCompleted === "boolean" ? isCompleted : false;
    const cleanTimestamp = Math.max(0, parseInt(resumeTimestamp, 10) || 0);

    const saved = await progressRepository.upsert(userId, lessonId, {
      isCompleted: cleanCompleted,
      resumeTimestamp: cleanTimestamp,
    });

    return {
      message: "Progress updated successfully",
      progress: saved,
    };
  },
};
