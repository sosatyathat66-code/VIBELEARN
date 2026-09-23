import { useState, useEffect } from "react";
import { lessonService } from "../services/lessonService.js";

export function useLesson(slug) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadLesson() {
      try {
        setLoading(true);
        const data = await lessonService.fetchLessonBySlug(slug);
        if (isMounted) {
          setLesson(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Failed to load lesson: ${slug}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { lesson, loading, error };
}
