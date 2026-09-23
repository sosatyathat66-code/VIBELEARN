import { lessonRepository } from "../repositories/lesson.repository.js";

export const lessonService = {
  /**
   * Get single lesson by slug including course context and next/prev navigation
   */
  async getLessonBySlug(slug) {
    if (!slug) {
      const err = new Error("Lesson slug is required");
      err.statusCode = 400;
      throw err;
    }

    const lesson = await lessonRepository.findBySlug(slug);
    if (!lesson) {
      const err = new Error(`Lesson not found for slug: ${slug}`);
      err.statusCode = 404;
      throw err;
    }

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      youtubeVideoId: lesson.youtubeVideoId,
      notes: lesson.notes || "",
      position: lesson.position,
      duration: lesson.duration || 0,
      freePreview: lesson.freePreview || false,
      module: lesson.module
        ? {
            id: lesson.module.id,
            title: lesson.module.title,
            course: lesson.module.course
              ? {
                  id: lesson.module.course.id,
                  title: lesson.module.course.title,
                  slug: lesson.module.course.slug,
                }
              : null,
          }
        : null,
      prevLesson: lesson.prevLesson || null,
      nextLesson: lesson.nextLesson || null,
    };
  },
};
