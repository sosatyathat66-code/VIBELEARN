import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "../../context/AuthContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded: clerkLoaded } = useUser();

  const isCoursesActive =
    location.pathname === "/" ||
    location.pathname.startsWith("/courses");
  const isMyLearningActive = location.pathname.startsWith("/my-learning");

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            {/* Vibe Learn Leaf Logo SVG */}
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-neutral-900 font-sans">
            Vibe <span className="text-primary-500">Learn</span>
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className={`text-sm font-semibold relative py-2 transition-colors ${
              isCoursesActive
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Courses
            {isCoursesActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
            )}
          </Link>
          <Link
            to="/my-learning"
            className={`text-sm font-semibold relative py-2 transition-colors ${
              isMyLearningActive
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            My Learning
            {isMyLearningActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notification Bell */}
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-500" />
          </button>

          {/* Clerk Auth Integration */}
          {clerkLoaded ? (
            <>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-primary-500/20",
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="h-10 px-5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm transition-colors shadow-sm shadow-primary-500/30">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            // Fallback for dev without live Clerk credentials configured
            <div className="flex items-center gap-3">
              <Link
                to="/my-learning"
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500/40 hover:border-primary-500 transition-colors shadow-sm"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isCoursesActive
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Courses
          </Link>
          <Link
            to="/my-learning"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isMyLearningActive
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            My Learning
          </Link>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Account</span>
            {clerkLoaded ? (
              <>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="h-9 px-4 rounded-lg bg-primary-500 text-white font-medium text-xs">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </>
            ) : (
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                Learner Profile
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
