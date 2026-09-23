import { db, isConnected } from "../db/index.js";
import { lessons } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { loadSeedData } from "../db/seed.js";

let memoryStore = null;

function getMemoryStore() {
  if (!memoryStore) {
    memoryStore = loadSeedData();
  }
  return memoryStore;
}

export const lessonRepository = {
  /**
   * Find lesson by slug with parent module & course context
   */
  async findBySlug(slug) {
    if (isConnected && db) {
      try {
        const lesson = await db.query.lessons.findFirst({
          where: eq(lessons.slug, slug),
          with: {
            module: {
              with: {
                course: true,
                lessons: {
                  orderBy: [asc(lessons.position)],
                },
              },
            },
          },
        });
        if (lesson) return lesson;
      } catch (err) {
        console.warn("[LessonRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const store = getMemoryStore();
    const lesson = store.lessons.find((l) => l.slug === slug);
    if (!lesson) return null;

    const moduleRecord = store.modules.find((m) => m.id === lesson.moduleId);
    const courseRecord = moduleRecord
      ? store.courses.find((c) => c.id === moduleRecord.courseId)
      : null;

    // Get all lessons for this course to calculate navigation order
    const courseModules = moduleRecord
      ? store.modules
          .filter((m) => m.courseId === moduleRecord.courseId)
          .sort((a, b) => a.position - b.position)
      : [];

    const allCourseLessons = [];
    courseModules.forEach((m) => {
      const modLessons = store.lessons
        .filter((l) => l.moduleId === m.id)
        .sort((a, b) => a.position - b.position);
      allCourseLessons.push(...modLessons);
    });

    const currentIndex = allCourseLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex !== -1 && currentIndex < allCourseLessons.length - 1
        ? allCourseLessons[currentIndex + 1]
        : null;

    return {
      ...lesson,
      module: moduleRecord
        ? {
            ...moduleRecord,
            course: courseRecord,
          }
        : null,
      prevLesson: prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null,
    };
  },

  /**
   * Find lesson by id
   */
  async findById(id) {
    if (isConnected && db) {
      try {
        const lesson = await db.query.lessons.findFirst({
          where: eq(lessons.id, id),
          with: {
            module: {
              with: {
                course: true,
              },
            },
          },
        });
        if (lesson) return lesson;
      } catch (err) {
        console.warn("[LessonRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const store = getMemoryStore();
    return store.lessons.find((l) => l.id === id) || null;
  },
};
