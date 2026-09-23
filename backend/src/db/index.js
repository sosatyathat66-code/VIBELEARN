import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import { env } from "../config/env.js";

let client = null;
let db = null;
let isConnected = false;

if (env.DATABASE_URL && env.DATABASE_URL.startsWith("postgres")) {
  try {
    client = postgres(env.DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client, { schema });
    isConnected = true;
  } catch (error) {
    console.warn("[Vibelearn DB] Could not initialize PostgreSQL client:", error.message);
  }
} else {
  console.log("[Vibelearn DB] DATABASE_URL not set or not postgres. Running with mock/seed memory repository fallback.");
}

export { db, client, isConnected, schema };
