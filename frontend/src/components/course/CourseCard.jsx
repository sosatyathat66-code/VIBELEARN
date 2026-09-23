import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Clock, BookOpen } from "lucide-react";
import Badge from "../common/Badge.jsx";

export default function CourseCard({ course }) {
  const {
    slug,
    title,
    summary,
    level,
    duration,
    totalModules,
    homeBadge,
    iconText,
    iconBg,
  } = course;

  return (
    <Link
      to={`/courses/${slug}`}
      className="group flex flex-col justify-between bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 relative overflow-hidden"
    >
      <div>
        {/* Top Header: Icon & Arrow Button */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${
              iconBg || "bg-neutral-900 text-white"
            }`}
          >
            {iconText}
          </div>

          <div className="w-9 h-9 rounded-full bg-neutral-100 group-hover:bg-primary-500 group-hover:text-white text-neutral-500 flex items-center justify-center transition-colors">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Badge */}
        {homeBadge && (
          <div className="mb-3">
            <Badge
              variant={
                homeBadge.toLowerCase() === "popular"
                  ? "popular"
                  : homeBadge.toLowerCase() === "trending"
                  ? "trending"
                  : "primary"
              }
            >
              {homeBadge}
            </Badge>
          </div>
        )}

        {/* Course Title */}
        <h3 className="font-semibold text-lg sm:text-xl text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 mb-6">
          {summary}
        </p>
      </div>

      {/* Meta Footer & Highlight bar */}
      <div>
        <div className="flex items-center gap-4 text-xs text-neutral-500 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-neutral-400" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>{totalModules} modules</span>
          </div>
        </div>

        {/* Bottom decorative primary bar */}
        <div className="mt-4 -mb-6 -mx-6 h-1 bg-primary-500 w-16 group-hover:w-full transition-all duration-300" />
      </div>
    </Link>
  );
}
