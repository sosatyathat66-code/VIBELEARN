import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Clock,
  BarChart2,
  Users,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Menu,
  FlaskConical,
} from "lucide-react";
import CurriculumSidebar from "../components/lesson/CurriculumSidebar.jsx";
import VideoPlayer from "../components/lesson/VideoPlayer.jsx";
import LessonNotes from "../components/lesson/LessonNotes.jsx";
import Badge from "../components/common/Badge.jsx";
import { useProgress } from "../hooks/useProgress.js";
import { useCourse } from "../hooks/useCourse.js";
import { useLesson } from "../hooks/useLesson.js";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { course, loading: courseLoading } = useCourse(courseSlug);
  const { lesson: apiLesson, loading: lessonLoading } = useLesson(lessonSlug);
  const {
    completedLessons,
    isCompleted,
    toggleComplete,
    calculateCourseProgress,
    getResumeTime,
    saveResumeTime,
  } = useProgress();

  if ((courseLoading || lessonLoading) && !course && !apiLesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const safeCourse = course || { title: "Course", slug: courseSlug, modules: [] };

  // Flatten all lessons to enable linear navigation
  const allLessons = [];
  safeCourse.modules?.forEach((mod) => {
    mod.lessons?.forEach((l) => {
      allLessons.push({ ...l, moduleTitle: mod.title, moduleOrder: mod.position || mod.order || 1 });
    });
  });

  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const currentLesson =
    apiLesson || (currentIndex !== -1 ? allLessons[currentIndex] : allLessons[0]) || {};
  const prevLesson =
    apiLesson?.prevLesson || (currentIndex > 0 ? allLessons[currentIndex - 1] : null);
  const nextLesson =
    apiLesson?.nextLesson ||
    (currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null);

  const isDone = isCompleted(currentLesson.id) || isCompleted(currentLesson.slug);
  const progressPercentage = calculateCourseProgress(safeCourse);
  const resumeSeconds = getResumeTime(currentLesson.id) || getResumeTime(currentLesson.slug) || 0;

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/courses/${safeCourse.slug}/lessons/${nextLesson.slug}`);
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      navigate(`/courses/${safeCourse.slug}/lessons/${prevLesson.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Sidebar Overlay Toggle Bar */}
      <div className="lg:hidden border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600"
        >
          <Menu className="w-4 h-4" />
          <span>View Curriculum ({safeCourse.modules?.length || 0} modules)</span>
        </button>

        <span className="text-xs font-semibold text-primary-600">
          {progressPercentage}% complete
        </span>
      </div>

      <div className="flex-1 flex max-w-full">
        {/* Left Curriculum Sidebar */}
        <CurriculumSidebar
          course={safeCourse}
          currentLessonSlug={currentLesson.slug}
          completedLessons={completedLessons}
          progressPercentage={progressPercentage}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}

        {/* Main Lesson Content Area */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-5">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link to="/courses" className="hover:text-primary-600 transition-colors">
              All Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link
              to={`/courses/${safeCourse.slug}`}
              className="hover:text-primary-600 transition-colors truncate max-w-[12rem]"
            >
              {safeCourse.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-800 font-semibold truncate">
              {currentLesson.moduleTitle}
            </span>
          </nav>

          {/* Lesson Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="mb-2">
                <Badge variant="lesson" size="sm">
                  Lesson {currentLesson.moduleOrder || 5}.{currentIndex + 1}
                </Badge>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                {currentLesson.title.includes("Caching") ? (
                  <>
                    Data Fetching &amp;{" "}
                    <span className="text-primary-500">Caching</span>
                  </>
                ) : (
                  currentLesson.title
                )}
              </h1>

              <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Learn how Next.js handles data fetching and caching in both Server and
                Client Components.
              </p>

              {/* Lesson Meta */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 mt-4 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>{currentLesson.duration || "1h 28m"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-neutral-400" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <span>3,426 students</span>
                </div>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              type="button"
              className="w-10 h-10 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Bookmark this lesson"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Video Player Embed with periodic timestamp tracking */}
          <VideoPlayer
            youtubeVideoId={currentLesson.youtubeVideoId || "9602Yzvd7ik"}
            title={currentLesson.title}
            resumeTimestamp={resumeSeconds}
            onTimeUpdate={(seconds) => {
              if (currentLesson.id) {
                saveResumeTime(currentLesson.id, seconds);
              }
            }}
          />

          {/* Lesson Content & Notes Tabs */}
          <LessonNotes lesson={currentLesson} />

          {/* Bottom Lesson Navigation Bar (matches learning-page.png) */}
          <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 pb-12">
            {/* Previous Lesson Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={!prevLesson}
              className={`h-11 px-5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                prevLesson
                  ? "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800"
                  : "border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            {/* Center: Mark as Complete / Session Code Lab */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleComplete(currentLesson.id || currentLesson.slug)}
                className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all ${
                  isDone
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-primary-400"
                }`}
              >
                <CheckCircle
                  className={`w-4 h-4 ${
                    isDone ? "text-primary-500 fill-primary-100" : "text-neutral-400"
                  }`}
                />
                <span>{isDone ? "Completed" : "Mark as Complete"}</span>
              </button>

              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-medium">
                <FlaskConical className="w-4 h-4 text-primary-600" />
                <span>Session Code Lab</span>
              </div>
            </div>

            {/* Next Lesson Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!nextLesson}
              className={`h-11 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all ${
                nextLesson
                  ? "bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
