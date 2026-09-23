import React, { useState } from "react";
import {
  CheckCircle2,
  Lightbulb,
  FlaskConical,
  ArrowUpRight,
  FileText,
  BookOpen,
  Github,
} from "lucide-react";

export default function LessonNotes({ lesson }) {
  const [activeTab, setActiveTab] = useState("content");

  // Format notes whether passed as string from backend or structured object
  const rawNotes = lesson?.notes;
  const isStringNotes = typeof rawNotes === "string" && rawNotes.trim().length > 0;

  const notes = {
    overview: isStringNotes
      ? rawNotes
      : rawNotes?.overview ||
        "In this lesson, you'll learn key principles and practical implementations to build fast and scalable applications.",
    codeLab:
      rawNotes?.codeLab ||
      "Open the code lab below to practice what you've learned. Write your code, see instant feedback, and build real features!",
    inThisLesson: Array.isArray(rawNotes?.inThisLesson)
      ? rawNotes.inThisLesson
      : [
          "Understand the core architecture and patterns for this topic",
          "Learn how data flows and how components communicate",
          "Implement optimizations and best practices",
        ],
    proTip:
      rawNotes?.proTip ||
      "Measure and test behavior on realistic network conditions before committing performance tradeoffs.",
    resources: Array.isArray(rawNotes?.resources)
      ? rawNotes.resources
      : [
          {
            title: "Official Documentation",
            desc: "The primary reference and API documentation.",
            url: "https://nextjs.org/docs",
            icon: "doc",
          },
        ],
  };

  return (
    <div className="mt-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-neutral-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "content"
              ? "text-neutral-900 font-bold"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          Lesson Content
          {activeTab === "content" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "notes"
              ? "text-neutral-900 font-bold"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          Notes
          {activeTab === "notes" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === "content" ? (
        <div className="space-y-8">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Overview</h3>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {notes.overview}
            </p>
          </div>

          {/* Session Code Lab Callout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-neutral-900 text-sm">
                    Session Code Lab
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-600">
                    Interactive
                  </span>
                </div>
                <p className="text-neutral-600 text-xs sm:text-sm">
                  {notes.codeLab}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="h-10 px-5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 shadow-sm shadow-primary-500/20 transition-colors"
            >
              <span>Open Lab</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* In this lesson you will: */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">
              In this lesson you will:
            </h4>
            <div className="space-y-2.5">
              {notes.inThisLesson.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="p-5 rounded-2xl bg-primary-50/40 border border-primary-200/60 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-1">Pro Tip</h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {notes.proTip}
              </p>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-4">Resources</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {notes.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-4 rounded-2xl border border-neutral-200 bg-white hover:border-primary-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      {res.icon === "book" ? (
                        <BookOpen className="w-4 h-4" />
                      ) : res.icon === "github" ? (
                        <Github className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                  </div>

                  <div>
                    <h5 className="font-semibold text-xs text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
                      {res.title}
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {res.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Personal Notes Tab */
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <h3 className="font-bold text-neutral-900 text-sm mb-2">My Notes</h3>
          <p className="text-neutral-500 text-xs mb-4">
            Type notes as you watch. They are saved in your local workspace.
          </p>
          <textarea
            className="w-full h-40 p-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            placeholder="E.g., Server Components do not ship JavaScript to the client bundle..."
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-xs hover:bg-primary-600 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
