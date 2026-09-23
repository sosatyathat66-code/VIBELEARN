import express from "express";
import cors from "cors";
import { env, validateEnv } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import progressRoutes from "./routes/progress.routes.js";

// Validate environment on startup
validateEnv();

const app = express();

// Parse allowed CORS origins
const allowedOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(",").map((origin) => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:5173"];

// Security & Parsing Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      // Allow localhost on any port in development
      if (env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "vibelearn-backend",
    timestamp: new Date().toISOString(),
  });
});

// API Root Info
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to Vibelearn API",
    version: "0.1.0",
  });
});

// Application API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server if directly run
if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`[Vibelearn Backend] Server running on http://localhost:${env.PORT}`);
    console.log(`[Vibelearn Backend] Environment: ${env.NODE_ENV}`);
  });
}

export default app;
