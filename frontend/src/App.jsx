import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import MyLearningPage from "./pages/MyLearningPage.jsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isValidClerkKey =
  clerkPublishableKey &&
  clerkPublishableKey.startsWith("pk_") &&
  !clerkPublishableKey.includes("your_clerk");

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/courses" element={<CatalogPage />} />
          <Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
          <Route
            path="/courses/:courseSlug/lessons/:lessonSlug"
            element={<LessonPage />}
          />
          <Route path="/my-learning" element={<MyLearningPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  if (isValidClerkKey) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ClerkProvider>
    );
  }

  // Graceful development mode without live Clerk key
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
