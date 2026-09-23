import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  BarChart2,
  Clock,
  BookOpen,
  Users,
  Play,
  Bookmark,
  Lightbulb,
  Layers,
  Database,
  Gauge,
  Cloud,
} from "lucide-react";
import Badge from "../components/common/Badge.jsx";
import ProgressBar from "../components/common/ProgressBar.jsx";
import ModuleAccordion from "../components/course/ModuleAccordion.jsx";
import { useProgress } from "../hooks/useProgress.js";
import { useCourse } from "../hooks/useCourse.js";

export default function CourseDetailPage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { course, loading } = useCourse(courseSlug);
  const { completedLessons, calculateCourseProgress } = useProgress();

  if (loading && !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-500">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Course Not Found</h2>
        <p className="text-neutral-500 mb-6">The requested course could not be loaded.</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const progressPercentage = calculateCourseProgress(course);

  // Resume at first incomplete lesson, or first lesson
  let resumeLessonSlug = course.modules?.[0]?.lessons?.[0]?.slug || "";
  for (const mod of course.modules || []) {
    for (const les of mod.lessons || []) {
      if (!completedLessons.includes(les.id) && !completedLessons.includes(les.slug)) {
        resumeLessonSlug = les.slug;
        break;
      }
    }
    if (resumeLessonSlug && resumeLessonSlug !== course.modules?.[0]?.lessons?.[0]?.slug) {
      break;
    }
  }

  const handleContinueLearning = () => {
    navigate(`/courses/${course.slug}/lessons/${resumeLessonSlug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 pb-28">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link to="/courses" className="hover:text-primary-600 transition-colors">
          All Courses
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-800 font-semibold truncate">
          {course.title}
        </span>
      </nav>

      {/* Course Hero Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        {/* Left: Cover Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 shadow-xl border border-neutral-200">
            <img
              src={course.coverImageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl mb-2">
                {course.iconText}
              </div>
              <span className="text-white font-mono text-sm tracking-widest uppercase">
                {course.slug.replace(/-/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Course Metadata & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <Badge variant="popular" icon="flame" size="md">
              {course.badge || "Popular"}
            </Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
            Next.js for <span className="text-primary-500">Production</span>
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            {course.summary}
          </p>

          {/* Meta Badges Row */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-neutral-600 pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{course.totalModules} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <span className="font-medium">{course.studentsCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleContinueLearning}
              className="h-12 px-7 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-md shadow-primary-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue Learning</span>
              <span className="text-primary-200">→</span>
            </button>

            <button
              type="button"
              className="h-12 px-6 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-sm sm:text-base flex items-center gap-2 shadow-xs transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmark</span>
            </button>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              What you&apos;ll learn
            </h2>
          </div>

          <span className="hidden sm:block text-primary-600 font-serif italic text-lg font-semibold">
            Build for real world
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {course.whatYouLearn?.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-start gap-4 hover:border-primary-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                {item.icon === "Layers" && <Layers className="w-6 h-6" />}
                {item.icon === "Database" && <Database className="w-6 h-6" />}
                {item.icon === "Gauge" && <Gauge className="w-6 h-6" />}
                {item.icon === "Cloud" && <Cloud className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-base text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Content Accordion Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Course Content
            </h2>
          </div>

          <span className="text-sm font-medium text-neutral-500">
            {course.modules?.length} modules • {course.duration}
          </span>
        </div>

        <ModuleAccordion
          modules={course.modules}
          courseSlug={course.slug}
          completedLessons={completedLessons}
        />
      </section>

      {/* Sticky Bottom Progress Bar (matches detail-page.png) */}
      <aside className="fixed bottom-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto flex-1 max-w-lg">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-500">Your Progress</span>
                <span className="text-neutral-900">{progressPercentage}% complete</span>
              </div>
              <ProgressBar progress={progressPercentage} height="h-2" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueLearning}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20 transition-colors flex-shrink-0"
          >
            <span>Continue Learning</span>
            <span>→</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
