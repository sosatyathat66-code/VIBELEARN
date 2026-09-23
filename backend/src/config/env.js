import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  DATABASE_URL: process.env.DATABASE_URL || "",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
};

/**
 * Validate presence of required environment variables in production
 */
export function validateEnv() {
  const missing = [];
  if (!env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!env.CLERK_SECRET_KEY) missing.push("CLERK_SECRET_KEY");
  if (!env.CLERK_PUBLISHABLE_KEY) missing.push("CLERK_PUBLISHABLE_KEY");

  if (missing.length > 0) {
    if (env.NODE_ENV === "production") {
      console.warn(
        `[Vibelearn Backend] ⚠️ WARNING: Missing production environment variables: ${missing.join(", ")}`
      );
      console.warn(
        "[Vibelearn Backend] Please configure these in your Render Dashboard / Environment settings."
      );
    } else {
      console.info(
        `[Vibelearn Backend] ℹ️ Running in development mode. Unset variables: ${missing.join(", ")}`
      );
    }
  } else {
    console.log("[Vibelearn Backend] ✅ Environment variables validated successfully.");
  }
}

