import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Play,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  MessageSquare,
} from "lucide-react";
import ProgressBar from "../common/ProgressBar.jsx";

export default function CurriculumSidebar({
  course,
  currentLessonSlug,
  completedLessons = [],
  progressPercentage = 35,
  isOpen = true,
  onClose,
}) {
  const navigate = useNavigate();
  // Find current module
  const currentModule = course.modules.find((mod) =>
    mod.lessons?.some((l) => l.slug === currentLessonSlug)
  ) || course.modules[0];

  const [expandedModules, setExpandedModules] = useState([currentModule?.order || 5]);

  const toggleModule = (order) => {
    setExpandedModules((prev) =>
      prev.includes(order) ? prev.filter((o) => o !== order) : [...prev, order]
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-80 lg:w-96 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top Header */}
      <div className="p-5 border-b border-neutral-100 flex-shrink-0">
        <Link
          to={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to course</span>
        </Link>

        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${
              course.iconBg || "bg-black text-white"
            }`}
          >
            {course.iconText}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-neutral-900 truncate">
              {course.title}
            </h3>
            <div className="mt-1">
              <ProgressBar progress={progressPercentage} height="h-1.5" />
              <span className="text-[11px] font-medium text-neutral-500 mt-1 block">
                {progressPercentage}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules & Lessons Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold text-neutral-700">
            Module {currentModule?.order || 1} of {course.modules.length}
          </span>
        </div>

        {course.modules.map((mod) => {
          const isExpanded = expandedModules.includes(mod.order);
          const isCurrentMod = mod.id === currentModule?.id;
          const isModuleCompleted =
            mod.lessons &&
            mod.lessons.length > 0 &&
            mod.lessons.every((l) => completedLessons.includes(l.id));

          return (
            <div
              key={mod.id}
              className={`rounded-xl border transition-all ${
                isCurrentMod
                  ? "border-primary-500/40 bg-primary-50/20"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {/* Module Header */}
              <button
                type="button"
                onClick={() => toggleModule(mod.order)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      isCurrentMod
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {mod.order}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-neutral-900">
                      {mod.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {mod.duration}
                      {isCurrentMod && (
                        <span className="ml-2 text-primary-600 font-semibold">
                          Now playing
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isModuleCompleted ? (
                    <Check className="w-4 h-4 text-primary-500" />
                  ) : isCurrentMod ? (
                    <Play className="w-3.5 h-3.5 text-primary-500 fill-current" />
                  ) : (
                    <span />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Sub-lessons */}
              {isExpanded && mod.lessons && (
                <div className="px-3 pb-3 pt-1 space-y-1 border-t border-neutral-100">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentLessonSlug;
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          navigate(`/courses/${course.slug}/lessons/${lesson.slug}`);
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          isActive
                            ? "bg-primary-100/70 text-primary-700 font-semibold"
                            : "hover:bg-neutral-100/70 text-neutral-700 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isActive
                                ? "bg-primary-500 ring-2 ring-primary-300"
                                : isDone
                                ? "bg-neutral-400"
                                : "border border-neutral-400 bg-transparent"
                            }`}
                          />
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span className="text-[10px] text-neutral-400 flex-shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Side Cards */}
      <div className="p-4 border-t border-neutral-100 space-y-2 flex-shrink-0 bg-neutral-50/60">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 transition-colors shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-neutral-900">
                Session Code Lab
              </div>
              <div className="text-[11px] text-neutral-500 line-clamp-1">
                Practice with real code &amp; tests
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-300 transition-colors shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-neutral-900">Need help?</div>
              <div className="text-[11px] text-neutral-500 line-clamp-1">
                Ask community or instructor
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
