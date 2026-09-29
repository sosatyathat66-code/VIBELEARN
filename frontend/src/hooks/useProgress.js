import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { progressService } from "../services/progressService.js";

const LOCAL_STORAGE_COMPLETED = "vibelearn_completed_lessons";
const LOCAL_STORAGE_RESUME = "vibelearn_resume_timestamps";

export function useProgress() {
  const { getToken, userId } = useAuth();

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_COMPLETED);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [resumeTimestamps, setResumeTimestamps] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_RESUME);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {};
  });

  const lastSavedRef = useRef({});

  // Fetch progress from backend on mount or user change
  useEffect(() => {
    let isMounted = true;

    async function loadBackendProgress() {
      try {
        const data = await progressService.fetchProgress(getToken);
        if (isMounted && data && Array.isArray(data.progress)) {
          const backendCompleted = [];
          const backendTimestamps = {};

          data.progress.forEach((p) => {
            if (p.isCompleted) {
              backendCompleted.push(p.lessonId);
            }
            if (p.resumeTimestamp > 0) {
              backendTimestamps[p.lessonId] = p.resumeTimestamp;
            }
          });

          setCompletedLessons((prev) => {
            const merged = Array.from(new Set([...prev, ...backendCompleted]));
            try {
              localStorage.setItem(LOCAL_STORAGE_COMPLETED, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });

          setResumeTimestamps((prev) => {
            const merged = { ...prev, ...backendTimestamps };
            try {
              localStorage.setItem(LOCAL_STORAGE_RESUME, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      } catch (err) {
        console.warn("[useProgress] Could not sync with backend progress API:", err.message);
      }
    }

    loadBackendProgress();

    return () => {
      isMounted = false;
    };
  }, [userId, getToken]);

  const isCompleted = useCallback(
    (lessonId) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  const toggleComplete = useCallback(
    async (lessonId) => {
      if (!lessonId) return;
      const willBeCompleted = !completedLessons.includes(lessonId);

      // Optimistic update
      setCompletedLessons((prev) => {
        const next = willBeCompleted
          ? [...prev, lessonId]
          : prev.filter((id) => id !== lessonId);
        try {
          localStorage.setItem(LOCAL_STORAGE_COMPLETED, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      // Sync with backend API
      try {
        await progressService.saveProgress(
          {
            lessonId,
            isCompleted: willBeCompleted,
            resumeTimestamp: resumeTimestamps[lessonId] || 0,
          },
          getToken
        );
      } catch (err) {
        console.warn("[useProgress] Failed saving toggleComplete to backend:", err.message);
      }
    },
    [completedLessons, resumeTimestamps, getToken]
  );

  const markCompleted = useCallback(
    async (lessonId) => {
      if (!lessonId || completedLessons.includes(lessonId)) return;

      setCompletedLessons((prev) => {
        const next = [...prev, lessonId];
        try {
          localStorage.setItem(LOCAL_STORAGE_COMPLETED, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      try {
        await progressService.saveProgress(
          {
            lessonId,
            isCompleted: true,
            resumeTimestamp: resumeTimestamps[lessonId] || 0,
          },
          getToken
        );
      } catch (err) {
        console.warn("[useProgress] Failed saving markCompleted to backend:", err.message);
      }
    },
    [completedLessons, resumeTimestamps, getToken]
  );

  const getResumeTime = useCallback(
    (lessonId) => resumeTimestamps[lessonId] || 0,
    [resumeTimestamps]
  );

  const saveResumeTime = useCallback(
    async (lessonId, seconds) => {
      if (!lessonId) return;
      const cleanSeconds = Math.max(0, Math.floor(seconds));

      // Throttle backend calls: don't send if timestamp difference is < 3 seconds
      const lastSaved = lastSavedRef.current[lessonId] || 0;
      if (Math.abs(cleanSeconds - lastSaved) < 3) return;

      lastSavedRef.current[lessonId] = cleanSeconds;

      // Update local state
      setResumeTimestamps((prev) => {
        const next = { ...prev, [lessonId]: cleanSeconds };
        try {
          localStorage.setItem(LOCAL_STORAGE_RESUME, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      // Sync with backend API
      try {
        await progressService.saveProgress(
          {
            lessonId,
            isCompleted: completedLessons.includes(lessonId),
            resumeTimestamp: cleanSeconds,
          },
          getToken
        );
      } catch (err) {
        console.warn("[useProgress] Failed saving resume time to backend:", err.message);
      }
    },
    [completedLessons, getToken]
  );

  const calculateCourseProgress = useCallback(
    (course) => {
      if (!course || !course.modules) return 0;
      let totalLessons = 0;
      let completedCount = 0;

      course.modules.forEach((mod) => {
        if (mod.lessons) {
          mod.lessons.forEach((l) => {
            totalLessons += 1;
            if (completedLessons.includes(l.id) || completedLessons.includes(l.slug)) {
              completedCount += 1;
            }
          });
        }
      });

      if (totalLessons === 0) return 0;
      return Math.round((completedCount / totalLessons) * 100);
    },
    [completedLessons]
  );

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
