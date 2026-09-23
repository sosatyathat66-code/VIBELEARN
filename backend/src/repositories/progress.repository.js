import crypto from "crypto";
import { db, isConnected } from "../db/index.js";
import { progress, users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { loadSeedData } from "../db/seed.js";

// In-memory progress store fallback
const memoryProgress = new Map();

export const progressRepository = {
  /**
   * Find all progress records for a user
   */
  async findByUser(userId) {
    if (isConnected && db) {
      try {
        const records = await db.query.progress.findMany({
          where: eq(progress.userId, userId),
          with: {
            lesson: true,
          },
        });
        return records;
      } catch (err) {
        console.warn("[ProgressRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const userProgress = [];
    const seed = loadSeedData();
    for (const val of memoryProgress.values()) {
      if (val.userId === userId) {
        const lesson = seed.lessons.find((l) => l.id === val.lessonId);
        userProgress.push({
          ...val,
          lesson: lesson || null,
        });
      }
    }
    return userProgress;
  },

  /**
   * Find progress for a specific user and lesson
   */
  async findByUserAndLesson(userId, lessonId) {
    if (isConnected && db) {
      try {
        const record = await db.query.progress.findFirst({
          where: and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)),
          with: {
            lesson: true,
          },
        });
        if (record) return record;
      } catch (err) {
        console.warn("[ProgressRepo] DB query failed, falling back to memory:", err.message);
      }
    }

    const key = `${userId}:${lessonId}`;
    return memoryProgress.get(key) || null;
  },

  /**
   * Upsert progress record
   */
  async upsert(userId, lessonId, data) {
    const isCompleted = typeof data.isCompleted === "boolean" ? data.isCompleted : false;
    const resumeTimestamp = Number(data.resumeTimestamp) || 0;
    const updatedAt = new Date();

    if (isConnected && db) {
      try {
        // Ensure user exists first
        await db
          .insert(users)
          .values({
            id: userId,
            email: `${userId}@vibelearn.local`,
          })
          .onConflictDoNothing();

        // Check if existing record
        const existing = await db.query.progress.findFirst({
          where: and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)),
        });

        if (existing) {
          const [updated] = await db
            .update(progress)
            .set({
              isCompleted,
              resumeTimestamp,
              updatedAt,
            })
            .where(eq(progress.id, existing.id))
            .returning();
          return updated;
        } else {
          const [created] = await db
            .insert(progress)
            .values({
              id: crypto.randomUUID(),
              userId,
              lessonId,
              isCompleted,
              resumeTimestamp,
              updatedAt,
            })
            .returning();
          return created;
        }
      } catch (err) {
        console.warn("[ProgressRepo] DB upsert failed, falling back to memory:", err.message);
      }
    }

    const key = `${userId}:${lessonId}`;
    const existing = memoryProgress.get(key);
    const record = {
      id: existing?.id || crypto.randomUUID(),
      userId,
      lessonId,
      isCompleted,
      resumeTimestamp,
      updatedAt,
    };
    memoryProgress.set(key, record);
    return record;
  },
};
