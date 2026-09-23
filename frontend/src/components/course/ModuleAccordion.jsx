import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Play, CheckCircle2 } from "lucide-react";

export default function ModuleAccordion({
  modules = [],
  courseSlug,
  completedLessons = [],
}) {
  const [expandedModules, setExpandedModules] = useState([1, 5]); // default expand module 1 & 5
  const [showAll, setShowAll] = useState(false);

  const toggleModule = (order) => {
    setExpandedModules((prev) =>
      prev.includes(order) ? prev.filter((o) => o !== order) : [...prev, order]
    );
  };

  const displayedModules = showAll ? modules : modules.slice(0, 6);

  return (
    <div className="space-y-3">
      {displayedModules.map((module) => {
        const isExpanded = expandedModules.includes(module.order);

        return (
          <div
            key={module.id}
            className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-colors"
          >
            {/* Module Accordion Header */}
            <button
              type="button"
              onClick={() => toggleModule(module.order)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-neutral-50/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {module.order}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-base">
                    {module.title}
                  </h4>
                  {module.subtitle && (
                    <p className="text-neutral-500 text-xs sm:text-sm line-clamp-1 mt-0.5">
                      {module.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-500 text-sm font-medium">
                <span>{module.duration}</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </div>
            </button>

            {/* Expanded Lessons List */}
            {isExpanded && (
              <div className="border-t border-neutral-100 bg-neutral-50/50 px-4 sm:px-6 py-3 space-y-2">
                {module.lessons && module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => {
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-neutral-200 transition-all text-sm group"
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          ) : (
                            <Play className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 flex-shrink-0" />
                          )}
                          <span
                            className={`font-medium ${
                              isDone
                                ? "text-neutral-500 line-through"
                                : "text-neutral-800 group-hover:text-primary-600"
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </div>

                        <span className="text-xs text-neutral-400">
                          {lesson.duration}
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-2 text-xs text-neutral-400 italic">
                    Lessons in this module will be available soon.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {modules.length > 6 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <span>{showAll ? "Show less" : `Show all ${modules.length} modules`}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
