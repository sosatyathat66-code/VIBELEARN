import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users Table
 * Stores basic user information synced from Clerk.
 * The primary key `id` corresponds directly to the Clerk User ID.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID (e.g. user_2...)
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Courses Table
 * Top-level learning entity containing metadata.
 */
export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Modules Table
 * Logical groupings of lessons within a course.
 */
export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
});

/**
 * Lessons Table
 * Actual learning content with video and notes.
 */
export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  youtubeVideoId: text("youtube_video_id"),
  notes: text("notes"),
  position: integer("position").notNull().default(0),
});

/**
 * Progress Table
 * Tracks a user's completion status and video resume timestamp per lesson.
 */
export const progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  resumeTimestamp: integer("resume_timestamp").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Table Relations
 */
export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  progress: many(progress),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progress),
}));
