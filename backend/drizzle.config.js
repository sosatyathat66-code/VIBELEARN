// Drizzle ORM configuration (To be fully configured in Phase 3)
import { env } from "./src/config/env.js";

/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL || "",
  },
};
