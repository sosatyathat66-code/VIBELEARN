import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-neutral-200 mt-20 overflow-hidden">
      {/* Subtle bottom green gradient ambient glow */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-100/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-sm shadow-primary-500/30">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900 font-sans">
            Vibe <span className="text-primary-500">Learn</span>
          </span>
        </div>

        {/* Motto */}
        <p className="text-sm font-medium text-neutral-500 mb-6">
          Better Skills. A Brighter Future.
        </p>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-xs text-neutral-600 mb-6 font-medium">
          <Link to="/courses" className="hover:text-primary-600 transition-colors">
            All Courses
          </Link>
          <Link to="/my-learning" className="hover:text-primary-600 transition-colors">
            My Learning
          </Link>
          <a href="#privacy" className="hover:text-primary-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-primary-600 transition-colors">
            Terms of Service
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Vibe Learn Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
