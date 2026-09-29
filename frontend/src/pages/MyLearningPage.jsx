import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useUser, SignedIn, SignedOut, SignInButton } from "../context/AuthContext.jsx";
import ProgressBar from "../components/common/ProgressBar.jsx";
import { MOCK_COURSES } from "../services/mockData.js";
import { useProgress } from "../hooks/useProgress.js";
import { useCourses } from "../hooks/useCourses.js";

export default function MyLearningPage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { completedLessons, calculateCourseProgress } = useProgress();

  const enrolledCourse = courses[0] || MOCK_COURSES[0];
  const progressPercent = calculateCourseProgress(enrolledCourse);

  const handleResume = () => {
    let nextSlug = "nextjs-app-router-in-depth-file-system-routing";
    if (enrolledCourse?.modules) {
      for (const mod of enrolledCourse.modules) {
        for (const les of mod.lessons || []) {
          if (!completedLessons.includes(les.id) && !completedLessons.includes(les.slug)) {
            nextSlug = les.slug;
            break;
          }
        }
        if (nextSlug !== "nextjs-app-router-in-depth-file-system-routing") break;
      }
    }
    navigate(`/courses/${enrolledCourse.slug}/lessons/${nextSlug}`);
  };

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Learner Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-primary-900 to-neutral-900 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
            Learner Dashboard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Welcome back, {user?.firstName || "Learner"}!
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl">
            Pick up right where you left off. Every minute invested brings you closer
            to production mastery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResume}
          className="h-12 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm flex items-center gap-2.5 shadow-md shadow-primary-500/30 transition-colors self-start md:self-auto relative z-10"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Resume Course</span>
        </button>
      </div>

      {/* Learning Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">3</div>
            <div className="text-xs text-neutral-500 font-medium">
              Enrolled Courses
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              {completedLessons.length}
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              Completed Lessons
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">6h 40m</div>
            <div className="text-xs text-neutral-500 font-medium">Hours Learned</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900">1</div>
            <div className="text-xs text-neutral-500 font-medium">Certificates</div>
          </div>
        </div>
      </div>

      {/* Courses in Progress Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            In Progress Courses
          </h2>
          <span className="text-xs font-semibold text-primary-600">
            Active Learning
          </span>
        </div>

        <div className="border border-neutral-200 rounded-3xl bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Course Icon & Details */}
            <div className="lg:col-span-6 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                N
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-primary-600 tracking-wider">
                  Next.js App Router
                </span>
                <h3 className="font-semibold text-xl text-neutral-900 mt-0.5">
                  {enrolledCourse.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1 line-clamp-2">
                  Next up: Module 5: Data Fetching &amp; Caching (Lesson 5.1: Data
                  Fetching in Server Components)
                </p>
              </div>
            </div>

            {/* Progress Bar & Percent */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                <span>Overall Progress</span>
                <span className="text-primary-600 font-bold">
                  {progressPercent}% Complete
                </span>
              </div>
              <ProgressBar progress={progressPercent} height="h-2.5" />
              <div className="text-[11px] text-neutral-400">
                {completedLessons.length} of 35 total lessons completed
              </div>
            </div>

            {/* Resume Button */}
            <div className="lg:col-span-2 flex justify-start lg:justify-end">
              <button
                type="button"
                onClick={handleResume}
                className="h-11 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-primary-500/25 transition-colors w-full lg:w-auto justify-center"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More Courses Callout */}
      <section className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-neutral-900">
            Looking for something new?
          </h3>
          <p className="text-neutral-500 text-sm">
            Browse our full catalog of backend, infrastructure, and web courses.
          </p>
        </div>

        <Link
          to="/courses"
          className="h-11 px-6 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors flex-shrink-0"
        >
          <span>Browse All Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );

  // If Clerk is initialized with live keys, protect via Clerk SignedIn/SignedOut
  if (isLoaded) {
    return (
      <>
        <SignedIn>{content}</SignedIn>
        <SignedOut>
          <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white border border-neutral-200 text-center space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900">
              Sign In to View Your Learning
            </h2>
            <p className="text-neutral-500 text-sm">
              Please sign in with your account to access your enrolled courses and
              saved progress.
            </p>
            <SignInButton mode="modal">
              <button className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-sm transition-colors">
                Sign In with Clerk
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </>
    );
  }

  // Fallback for dev mode preview
  return content;
}
