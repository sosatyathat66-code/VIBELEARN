# Vibelearn Production Deployment Guide

This guide details the end-to-end production deployment process for the **Vibelearn** platform following the official system architecture:
- **Frontend:** React + Vite Single Page Application deployed to **Vercel** (Native runtime).
- **Backend:** Node.js Express REST API deployed to **Render** (Native Web Service runtime).
- **Database:** Managed PostgreSQL hosted on **Supabase** via Drizzle ORM.
- **Authentication:** **Clerk** (Client React SDK + Server JWT verification).
- **Architecture Constraint:** Zero containerization (Docker/Kubernetes are strictly disallowed per `docs/system_design/architecture.md`).

---

## 1. Prerequisites Checklist

Before beginning deployment, ensure you have active accounts on:
- [GitHub](https://github.com) (Repository containing the project code)
- [Supabase](https://supabase.com) (Database)
- [Clerk](https://clerk.com) (Authentication)
- [Render](https://render.com) (Backend API hosting)
- [Vercel](https://vercel.com) (Frontend hosting)

---

## 2. Step 1: Database Setup (Supabase)

1. **Create Supabase Project:**
   - Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **New project**.
   - Enter project name (e.g. `vibelearn-prod`) and a strong database password.
   - Choose a region closest to your target users and Render backend (e.g. `US East / Oregon`).

2. **Obtain Connection String:**
   - Navigate to **Project Settings** -> **Database**.
   - Under **Connection string**, select **URI**.
   - Copy the connection URI:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
   - Note: For serverless / pooled connections, you can use port `6543` (Connection Pooler).

---

## 3. Step 2: Authentication Setup (Clerk)

1. **Create Clerk Application:**
   - Log in to [Clerk Dashboard](https://dashboard.clerk.com) and create an application (e.g. `Vibelearn`).
   - Enable desired sign-in providers (Email, Google, GitHub).

2. **Obtain API Keys:**
   - Navigate to **API Keys** in the Clerk dashboard.
   - Copy:
     - **Publishable Key:** `pk_live_...` (or `pk_test_...` for staging)
     - **Secret Key:** `sk_live_...` (or `sk_test_...` for staging)

3. **Configure Domains / Paths (Post-Frontend Deploy):**
   - Once your Vercel domain is live (e.g. `https://vibelearn.vercel.app`), add it to the Clerk **Allowed Origins** and **Redirect URLs** settings.

---

## 4. Step 3: Backend Deployment (Render)

Render hosts the Express API as a native Web Service.

### Option A: Render Blueprint (Recommended)
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
3. Connect your repository. Render automatically reads the root [`render.yaml`](../render.yaml).
4. Fill in the prompted secret environment variables:
   - `DATABASE_URL`: Your Supabase connection string.
   - `CLIENT_URL`: `https://your-app.vercel.app` (or temporary `*` / localhost until frontend is deployed).
   - `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
   - `CLERK_SECRET_KEY`: Your Clerk secret key.
5. Click **Apply**. Render will trigger the build and start the service.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure service settings:
   - **Name:** `vibelearn-api`
   - **Region:** Choose same region as Supabase (e.g., `Oregon`).
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run db:push && npm run db:seed`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
4. In **Environment Variables**, add:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Enables production mode & security |
   | `PORT` | `5000` | Render defaults or injects PORT |
   | `DATABASE_URL` | `postgresql://...` | Supabase PostgreSQL URI |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | Allowed CORS origins (comma-separated) |
   | `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk Publishable Key |
   | `CLERK_SECRET_KEY` | `sk_live_...` | Clerk Secret Key |
5. Click **Create Web Service**.
6. When deployment finishes, copy the live URL (e.g., `https://vibelearn-api.onrender.com`).

### Verify Backend Health:
Visit `https://vibelearn-api.onrender.com/health` in your browser. Expected response:
```json
{
  "status": "ok",
  "service": "vibelearn-backend",
  "timestamp": "2026-09-23T..."
}
```

---

## 5. Step 4: Frontend Deployment (Vercel)

Vercel hosts the Vite React Single Page Application.

1. In [Vercel Dashboard](https://vercel.com/new), import your GitHub repository.
2. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend`.
   - **Build Command:** `npm run build` (or default `vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk Publishable Key |
   | `VITE_API_URL` | `https://vibelearn-api.onrender.com/api` | Render backend API endpoint |
4. Click **Deploy**.
5. Once deployment completes, Vercel provides your live production domain (e.g. `https://vibelearn.vercel.app`).
6. **Important:** Go back to your Render Dashboard backend settings and update `CLIENT_URL` to match your Vercel URL (e.g. `https://vibelearn.vercel.app`).

---

## 6. Step 5: Post-Deployment Smoke Test

Perform this check on the live production URL:

1. **Catalog Browsing (Public):**
   - Visit `https://your-frontend.vercel.app/`
   - Verify all 10 seeded courses are displayed with cover images, instructor badges, and summaries.
2. **Course Detail & Lesson Routing:**
   - Click any course (e.g. `/courses/mastering-react`).
   - Refresh the page: verify the page reloads properly without 404 (handled by `vercel.json` rewrites).
   - Click a lesson to navigate to `/lessons/:slug`.
   - Verify the YouTube video player loads, video playback starts, and lesson notes display correctly.
3. **Authentication:**
   - Click **Sign In** or **Sign Up** in the navigation bar.
   - Complete Clerk authentication flow.
   - Verify avatar / user profile appears in the header.
4. **Progress Tracking (Protected):**
   - Play a video for at least 10 seconds.
   - Refresh the lesson page: verify playback resumes at the saved timestamp.
   - Click **Mark as Complete**: verify completion checkmark appears and updates curriculum sidebar.
   - Navigate to `/my-learning`: verify the enrolled course shows progress percentage.

---

## 7. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on direct route refresh | Missing SPA rewrite on Vercel | Verify [`frontend/vercel.json`](../frontend/vercel.json) contains `{ "source": "/(.*)", "destination": "/index.html" }`. |
| CORS error in browser console | Mismatched `CLIENT_URL` | Ensure `CLIENT_URL` on Render matches your exact Vercel domain (without trailing slash). |
| Missing courses or empty catalog | Seeder did not run | Check Render build logs for `[Vibelearn Seeder]`. Run `npm run db:seed` in Render Shell. |
| 401 Unauthorized on `/api/progress` | Missing or invalid Clerk Secret Key | Verify `CLERK_SECRET_KEY` in Render environment variables matches Clerk dashboard. |
