import { db, isConnected } from "../db/index.js";
import { courses, modules, lessons } from "../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { loadSeedData } from "../db/seed.js";

let memoryStore = null;

function getMemoryStore() {
  if (!memoryStore) {
    memoryStore = loadSeedData();
  }
  return memoryStore;
}

export const courseRepository = {
  /**
   * Find all courses with module and lesson counts
   */
  async findAll() {
    if (isConnected && db) {
      try {
        const allCourses = await db.query.courses.findMany({
          with: {
            modules: {
              with: {
                lessons: true,
              },
              orderBy: [asc(modules.position)],
            },
          },
          orderBy: [asc(courses.createdAt)],
        });
        return allCourses;
      } catch (err) {
        console.warn("[CourseRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    // Fallback store
    const store = getMemoryStore();
    return store.courses.map((course) => {
      const courseModules = store.modules
        .filter((m) => m.courseId === course.id)
        .sort((a, b) => a.position - b.position)
        .map((m) => {
          const modLessons = store.lessons
            .filter((l) => l.moduleId === m.id)
            .sort((a, b) => a.position - b.position);
          return {
            ...m,
            lessons: modLessons,
          };
        });

      return {
        ...course,
        modules: courseModules,
      };
    });
  },

  /**
   * Find a single course by its slug with nested modules and lessons
   */
  async findBySlug(slug) {
    if (isConnected && db) {
      try {
        const course = await db.query.courses.findFirst({
          where: eq(courses.slug, slug),
          with: {
            modules: {
              with: {
                lessons: {
                  orderBy: [asc(lessons.position)],
                },
              },
              orderBy: [asc(modules.position)],
            },
          },
        });
        if (course) return course;
      } catch (err) {
        console.warn("[CourseRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const store = getMemoryStore();
    const course = store.courses.find((c) => c.slug === slug);
    if (!course) return null;

    const courseModules = store.modules
      .filter((m) => m.courseId === course.id)
      .sort((a, b) => a.position - b.position)
      .map((m) => {
        const modLessons = store.lessons
          .filter((l) => l.moduleId === m.id)
          .sort((a, b) => a.position - b.position);
        return {
          ...m,
          lessons: modLessons,
        };
      });

    return {
      ...course,
      modules: courseModules,
    };
  },

  /**
   * Find a single course by its ID
   */
  async findById(id) {
    if (isConnected && db) {
      try {
        const course = await db.query.courses.findFirst({
          where: eq(courses.id, id),
          with: {
            modules: {
              with: {
                lessons: true,
              },
              orderBy: [asc(modules.position)],
            },
          },
        });
        if (course) return course;
      } catch (err) {
        console.warn("[CourseRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const store = getMemoryStore();
    const course = store.courses.find((c) => c.id === id);
    if (!course) return null;

    const courseModules = store.modules
      .filter((m) => m.courseId === course.id)
      .sort((a, b) => a.position - b.position)
      .map((m) => {
        const modLessons = store.lessons
          .filter((l) => l.moduleId === m.id)
          .sort((a, b) => a.position - b.position);
        return {
          ...m,
          lessons: modLessons,
        };
      });

    return {
      ...course,
      modules: courseModules,
    };
  },
};
