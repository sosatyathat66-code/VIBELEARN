import { courseRepository } from "../repositories/course.repository.js";

/**
 * Format total seconds to human-readable duration (e.g., "18h 24m" or "45m")
 */
function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export const courseService = {
  /**
   * Get all courses for catalog
   */
  async getAllCourses() {
    const rawCourses = await courseRepository.findAll();

    return rawCourses.map((course) => {
      let totalLessons = 0;
      let totalDurationSeconds = 0;

      const modules = (course.modules || []).map((m) => {
        const modLessons = m.lessons || [];
        totalLessons += modLessons.length;
        modLessons.forEach((l) => {
          totalDurationSeconds += l.duration || 0;
        });

        return {
          id: m.id,
          title: m.title,
          position: m.position,
          lessonCount: modLessons.length,
        };
      });

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        summary: course.summary,
        coverImageUrl: course.coverImageUrl,
        totalModules: modules.length,
        totalLessons,
        duration: formatDuration(totalDurationSeconds),
        totalDurationSeconds,
        createdAt: course.createdAt,
      };
    });
  },

  /**
   * Get course details with modules and lessons by course slug
   */
  async getCourseBySlug(slug) {
    if (!slug) {
      const err = new Error("Course slug is required");
      err.statusCode = 400;
      throw err;
    }

    const course = await courseRepository.findBySlug(slug);
    if (!course) {
      const err = new Error(`Course not found for slug: ${slug}`);
      err.statusCode = 404;
      throw err;
    }

    let totalLessons = 0;
    let totalDurationSeconds = 0;

    const formattedModules = (course.modules || []).map((m) => {
      let moduleDurationSeconds = 0;
      const formattedLessons = (m.lessons || []).map((l) => {
        totalLessons += 1;
        const dur = l.duration || 0;
        totalDurationSeconds += dur;
        moduleDurationSeconds += dur;

        return {
          id: l.id,
          title: l.title,
          slug: l.slug,
          youtubeVideoId: l.youtubeVideoId,
          duration: formatDuration(dur),
          durationSeconds: dur,
          position: l.position,
          freePreview: l.freePreview || false,
        };
      });

      return {
        id: m.id,
        title: m.title,
        position: m.position,
        duration: formatDuration(moduleDurationSeconds),
        durationSeconds: moduleDurationSeconds,
        lessons: formattedLessons,
      };
    });

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      summary: course.summary,
      coverImageUrl: course.coverImageUrl,
      totalModules: formattedModules.length,
      totalLessons,
      duration: formatDuration(totalDurationSeconds),
      totalDurationSeconds,
      createdAt: course.createdAt,
      modules: formattedModules,
    };
  },
};
