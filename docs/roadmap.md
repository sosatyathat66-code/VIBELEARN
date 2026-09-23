# Vibelearn Implementation Roadmap

This roadmap defines the strict order of implementation for the Vibelearn project. 

**AI INSTRUCTION:** When implementing this project, you must follow this roadmap sequentially. Do not skip phases or combine tasks unless explicitly instructed by the user. Before writing code for any phase, create the implementation prompt in `prompts/` and get user approval as per `AGENTS.md`.

---

## Phase 1: Foundation (Repo Setup)
**Goal:** Initialize the monorepo structure and establish the core technology stack.

- [x] 1.1: Initialize `frontend` folder with Vite (React, JavaScript).
- [x] 1.2: Initialize `backend` folder with Node.js (Express, JavaScript).
- [x] 1.3: Setup TailwindCSS in the `frontend`.
- [x] 1.4: Configure ESLint and Prettier across both workspaces.
- [x] 1.5: Create `.env.example` in both `frontend` and `backend` (stubs for Clerk, Supabase, API URLs).
- [x] 1.6: Verify both development servers start successfully (`npm run dev`).
- [x] 1.7: **CHECKPOINT:** Get user approval before moving to the frontend.

## Phase 2: Frontend First (UI & Layouts)
**Goal:** Build the complete UI using mock data before touching the backend.

- [x] 2.1: Draft and finalize `docs/system_design/DESIGN.md` to establish UI consistency guidelines.
- [x] 2.2: Implement the global design system (typography, colors) in Tailwind.
- [x] 2.3: Integrate Clerk React SDK into the `frontend` for Sign Up / Log In UI.
- [x] 2.4: Protect specific frontend routes (e.g., `/my-learning`) using Clerk components.
- [x] 2.5: Build the Public Catalog Page (using mock course data).
- [x] 2.6: Build the Course Detail Page (using mock module/lesson data).
- [x] 2.7: Build the Lesson Page UI (YouTube embed, curriculum sidebar, text notes).
- [x] 2.8: Build the "My Learning" Dashboard (using mock progress data).
- [x] 2.9: Ensure mobile responsiveness across all pages.
- [x] 2.10: **CHECKPOINT:** Perform a full UI audit against the provided reference images and verify auth flows.

## Phase 3: Backend & Database
**Goal:** Create the database schema, seed data, and expose the APIs.

- [x] 3.1: Setup Supabase connection in the `backend`.
- [x] 3.2: Configure Drizzle ORM and define the schema (`users`, `courses`, `modules`, `lessons`, `progress`).
- [x] 3.3: Generate and run the initial database migration.
- [x] 3.4: Write and execute a seeding script to parse `docs/seed.ndjson` and `docs/videos.json` into the database.
- [x] 3.5: Create read-only public endpoints (`GET /api/courses`, `GET /api/courses/:slug`, `GET /api/lessons/:slug`).
- [x] 3.6: Create protected endpoints (`GET /api/progress`, `POST /api/progress`).
- [x] 3.7: **CHECKPOINT:** Verify APIs return the correct seeded data and progress data via curl/Postman.

## Phase 4: Integration (Auth & Data Hookup)
**Goal:** Secure the application and connect the frontend to the real backend APIs.

- [x] 4.1: Setup Express middleware in the `backend` to verify Clerk JWTs for protected routes.
- [x] 4.2: Swap frontend mock data with real API calls to the backend (`courses`, `modules`, `lessons`).
- [x] 4.3: Integrate progress tracking: periodically save video timestamps to the backend and implement "Mark as Complete".
- [x] 4.4: **CHECKPOINT:** End-to-end testing: User can log in, watch a video, leave, and resume from the saved timestamp.

## Phase 5: Deployment
**Goal:** Deploy the application to production.

- [x] 5.1: Run linting on both frontend and backend.
- [x] 5.2: Prepare deployment configurations for Vercel (Frontend).
- [x] 5.3: Prepare deployment configurations for Render (Backend).
- [x] 5.4: Deploy and verify production environment variables.
- [x] 5.5: **CHECKPOINT:** Project is live and fully functional.

