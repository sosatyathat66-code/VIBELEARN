import { useState, useEffect } from "react";
import { courseService } from "../services/courseService.js";

export function useCourse(slug) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadCourse() {
      try {
        setLoading(true);
        const data = await courseService.fetchCourseBySlug(slug);
        if (isMounted) {
          setCourse(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Failed to load course: ${slug}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { course, loading, error };
}
