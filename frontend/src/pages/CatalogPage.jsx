import React from "react";
import {
  ArrowRight,
  Brain,
  Zap,
  GitFork,
  Users,
  Code2,
  GraduationCap,
  Play,
} from "lucide-react";
import Badge from "../components/common/Badge.jsx";
import CourseCard from "../components/course/CourseCard.jsx";
import { WHY_VIBE_LEARN_FEATURES } from "../services/mockData.js";
import { useCourses } from "../hooks/useCourses.js";

export default function CatalogPage() {
  const { courses, loading } = useCourses();

  const scrollToCourses = () => {
    const el = document.getElementById("courses-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-10 overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Action */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <Badge variant="subtle" icon="sparkle" size="md">
                  Intelligent Learning
                </Badge>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
                Learn in a <span className="text-primary-500">smarter</span>,{" "}
                <span className="text-primary-500">faster</span> way.
              </h1>

              <p className="text-neutral-600 text-base sm:text-lg max-w-lg leading-relaxed">
                Vibe Learn helps you build real skills with structured courses,
                hands-on practice and personalized learning paths.
              </p>

              <div>
                <button
                  type="button"
                  onClick={scrollToCourses}
                  className="h-12 px-7 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium text-base inline-flex items-center gap-2.5 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 transition-all group"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Hero Graphic Illustration (matches home-page.png) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-primary-100/60 via-primary-50/40 to-emerald-100/30 p-8 flex items-center justify-center border border-primary-100/60 shadow-lg">
                {/* Floating Decorative Tags */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary-600 animate-bounce duration-1000">
                  <Code2 className="w-6 h-6" />
                </div>

                <div className="absolute top-8 right-12 w-14 h-14 rounded-2xl bg-primary-500 text-white shadow-md shadow-primary-500/30 flex items-center justify-center">
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                </div>

                <div className="absolute bottom-8 right-6 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary-600">
                  <span className="font-mono font-bold text-xs">&lt;/&gt;</span>
                </div>

                {/* Central Laptop Canvas */}
                <div className="w-64 h-44 rounded-2xl bg-white shadow-xl border border-neutral-200/80 p-4 flex flex-col justify-between items-center text-center relative z-10">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-2 shadow-inner">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="w-full space-y-1.5 pb-2">
                    <div className="w-3/4 h-2 bg-neutral-200 rounded-full mx-auto" />
                    <div className="w-1/2 h-2 bg-primary-200 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Learning Paths Section */}
      <section id="courses-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-2">
              — OUR COURSES
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              Popular Learning Paths
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-xl">
              Choose from our curated courses and start your journey towards new skills
              and better opportunities.
            </p>
          </div>

          {/* Decorative Callout */}
          <div className="hidden md:block text-right">
            <div className="text-primary-600 font-serif italic text-2xl font-bold tracking-tight">
              Learn <br />
              <span className="ml-3">Grow</span> <br />
              <span className="underline decoration-primary-300 decoration-wavy ml-6">
                Achieve
              </span>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-neutral-500">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading courses...</p>
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </section>

      {/* Why Vibe Learn? Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-50 border border-neutral-200/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-widest text-primary-600 uppercase">
                WHY VIBE LEARN?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                Build the skills that matter.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                More than just courses — Vibe Learn gives you the tools, support,
                and structure to grow your career and achieve your goals.
              </p>
            </div>

            {/* Right 2x2 Feature Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {WHY_VIBE_LEARN_FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center text-primary-600 flex-shrink-0">
                    {feature.icon === "Brain" && <Brain className="w-5 h-5" />}
                    {feature.icon === "Zap" && <Zap className="w-5 h-5" />}
                    {feature.icon === "GitFork" && <GitFork className="w-5 h-5" />}
                    {feature.icon === "Users" && <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
