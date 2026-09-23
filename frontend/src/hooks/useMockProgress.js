import { useState, useEffect } from "react";

const STORAGE_KEY = "vibelearn_completed_lessons";
const RESUME_KEY = "vibelearn_resume_timestamps";

export function useMockProgress() {
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default mock: Lessons 1.1, 1.2, 2.1, 3.1, 4.1 completed (~35% of Next.js course)
    return ["les-1-1", "les-1-2", "les-2-1", "les-3-1", "les-4-1"];
  });

  const [resumeTimestamps, setResumeTimestamps] = useState(() => {
    try {
      const stored = localStorage.getItem(RESUME_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      "les-5-1": 765, // 12:45
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
    } catch {
      // ignore
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(RESUME_KEY, JSON.stringify(resumeTimestamps));
    } catch {
      // ignore
    }
  }, [resumeTimestamps]);

  const isCompleted = (lessonId) => completedLessons.includes(lessonId);

  const toggleComplete = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const markCompleted = (lessonId) => {
    setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  };

  const getResumeTime = (lessonId) => resumeTimestamps[lessonId] || 0;

  const saveResumeTime = (lessonId, seconds) => {
    setResumeTimestamps((prev) => ({
      ...prev,
      [lessonId]: seconds,
    }));
  };

  const calculateCourseProgress = (course) => {
    if (!course || !course.modules) return 0;
    let totalLessons = 0;
    let completedCount = 0;

    course.modules.forEach((mod) => {
      if (mod.lessons) {
        mod.lessons.forEach((l) => {
          totalLessons += 1;
          if (completedLessons.includes(l.id)) {
            completedCount += 1;
          }
        });
      }
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  };

  return {
    completedLessons,
    isCompleted,
    toggleComplete,
    markCompleted,
    getResumeTime,
    saveResumeTime,
    calculateCourseProgress,
  };
}
