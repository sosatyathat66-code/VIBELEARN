import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { db, isConnected } from "./index.js";
import { users, courses, modules, lessons } from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to data sources with resilient lookup
function findDataFilePath(fileName) {
  const candidates = [
    path.resolve(__dirname, `../../../docs/${fileName}`),
    path.resolve(__dirname, `../../docs/${fileName}`),
    path.resolve(process.cwd(), `docs/${fileName}`),
    path.resolve(process.cwd(), `../docs/${fileName}`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

const SEED_NDJSON_PATH = findDataFilePath("seed.ndjson");
const VIDEOS_JSON_PATH = findDataFilePath("videos.json");


/**
 * Convert Portable Text blocks array to readable Markdown text
 */
function portableTextToMarkdown(blocks, keyPoints = [], proTip = "", resources = []) {
  const parts = [];

  if (Array.isArray(blocks)) {
    for (const block of blocks) {
      if (block._type === "block" && Array.isArray(block.children)) {
        const text = block.children.map((c) => c.text || "").join("");
        if (block.style === "h2") {
          parts.push(`\n## ${text}\n`);
        } else if (block.style === "h3") {
          parts.push(`\n### ${text}\n`);
        } else if (block.listItem === "bullet") {
          parts.push(`- ${text}`);
        } else if (block.listItem === "number") {
          parts.push(`1. ${text}`);
        } else {
          parts.push(`${text}\n`);
        }
      }
    }
  }

  if (Array.isArray(keyPoints) && keyPoints.length > 0) {
    parts.push("\n### Key Takeaways");
    keyPoints.forEach((kp) => parts.push(`- ${kp}`));
  }

  if (proTip) {
    parts.push(`\n> **Pro Tip:** ${proTip}\n`);
  }

  if (Array.isArray(resources) && resources.length > 0) {
    parts.push("\n### Resources");
    resources.forEach((r) => {
      if (r.url && r.title) {
        parts.push(`- [${r.title}](${r.url})${r.description ? ` — ${r.description}` : ""}`);
      }
    });
  }

  return parts.join("\n").trim();
}

/**
 * Extract YouTube video ID from URL or videos.json
 */
function extractYoutubeId(url, fallbackSlug, videosData) {
  if (url) {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match && match[1]) return match[1];
  }
  if (videosData && fallbackSlug && videosData[fallbackSlug]) {
    return videosData[fallbackSlug].id || null;
  }
  return null;
}

/**
 * Parse docs/seed.ndjson and docs/videos.json into normalized relational entities
 */
export function loadSeedData() {
  if (!fs.existsSync(SEED_NDJSON_PATH)) {
    throw new Error(`seed.ndjson not found at ${SEED_NDJSON_PATH}`);
  }

  let videosData = {};
  if (fs.existsSync(VIDEOS_JSON_PATH)) {
    try {
      videosData = JSON.parse(fs.readFileSync(VIDEOS_JSON_PATH, "utf-8"));
    } catch (err) {
      console.warn("Could not parse videos.json:", err.message);
    }
  }

  const rawLines = fs.readFileSync(SEED_NDJSON_PATH, "utf-8").split("\n").filter(Boolean);
  const items = rawLines.map((line) => JSON.parse(line));

  // Map raw lessons by Sanity _id (e.g., "lesson.nextjs-app-router-in-depth-file-system-routing")
  const rawLessonsById = new Map();
  for (const item of items) {
    if (item._type === "lesson") {
      rawLessonsById.set(item._id, item);
    }
  }

  const parsedCourses = [];
  const parsedModules = [];
  const parsedLessons = [];

  // Parse courses and their nested modules and lesson references
  for (const item of items) {
    if (item._type === "course") {
      const courseId = crypto.randomUUID();
      const courseSlug = item.slug?.current || item._id.replace(/^course\./, "");
      const coverImageUrl =
        item.coverImage?._sanityAsset?.replace(/^image@/, "") ||
        "https://picsum.photos/seed/course/1600/900";

      const courseRecord = {
        id: courseId,
        title: item.title,
        slug: courseSlug,
        summary: item.summary || "",
        coverImageUrl,
        createdAt: new Date(),
      };
      parsedCourses.push(courseRecord);

      // Process modules
      if (Array.isArray(item.modules)) {
        item.modules.forEach((mod, modIndex) => {
          const moduleId = crypto.randomUUID();
          const moduleRecord = {
            id: moduleId,
            courseId: courseId,
            title: mod.title || `Module ${modIndex + 1}`,
            position: modIndex + 1,
          };
          parsedModules.push(moduleRecord);

          // Process module's lessons
          if (Array.isArray(mod.lessons)) {
            mod.lessons.forEach((lessonRef, lessonIndex) => {
              const refId = lessonRef._ref;
              const rawLesson = rawLessonsById.get(refId);

              if (rawLesson) {
                const lessonId = crypto.randomUUID();
                const lessonSlug = rawLesson.slug?.current || rawLesson._id.replace(/^lesson\./, "");
                const youtubeVideoId = extractYoutubeId(rawLesson.videoUrl, lessonSlug, videosData);
                const notes = portableTextToMarkdown(
                  rawLesson.notes,
                  rawLesson.keyPoints,
                  rawLesson.proTip,
                  rawLesson.resources
                );

                const lessonRecord = {
                  id: lessonId,
                  moduleId: moduleId,
                  title: rawLesson.title,
                  slug: lessonSlug,
                  youtubeVideoId,
                  notes,
                  position: lessonIndex + 1,
                  duration: rawLesson.duration || 0,
                  freePreview: !!rawLesson.freePreview,
                };
                parsedLessons.push(lessonRecord);
              }
            });
          }
        });
      }
    }
  }

  // Pre-configured test user
  const parsedUsers = [
    {
      id: "test-user-1",
      email: "learner@vibelearn.dev",
      createdAt: new Date(),
    },
  ];

  return {
    courses: parsedCourses,
    modules: parsedModules,
    lessons: parsedLessons,
    users: parsedUsers,
  };
}

/**
 * Execute Seeding Script
 */
export async function runSeed() {
  console.log("[Vibelearn Seeder] Loading seed data from ndjson and videos.json...");
  const data = loadSeedData();
  console.log(
    `[Vibelearn Seeder] Parsed: ${data.courses.length} courses, ${data.modules.length} modules, ${data.lessons.length} lessons.`
  );

  if (isConnected && db) {
    try {
      console.log("[Vibelearn Seeder] Inserting records into PostgreSQL database...");
      for (const u of data.users) {
        await db.insert(users).values(u).onConflictDoNothing();
      }
      for (const c of data.courses) {
        await db.insert(courses).values({
          id: c.id,
          title: c.title,
          slug: c.slug,
          summary: c.summary,
          coverImageUrl: c.coverImageUrl,
          createdAt: c.createdAt,
        }).onConflictDoNothing();
      }
      for (const m of data.modules) {
        await db.insert(modules).values({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          position: m.position,
        }).onConflictDoNothing();
      }
      for (const l of data.lessons) {
        await db.insert(lessons).values({
          id: l.id,
          moduleId: l.moduleId,
          title: l.title,
          slug: l.slug,
          youtubeVideoId: l.youtubeVideoId,
          notes: l.notes,
          position: l.position,
        }).onConflictDoNothing();
      }
      console.log("[Vibelearn Seeder] Successfully seeded PostgreSQL database.");
    } catch (err) {
      console.error("[Vibelearn Seeder] Failed inserting into PostgreSQL:", err);
      throw err;
    }
  } else {
    console.log("[Vibelearn Seeder] No live database connection. Seed data loaded and ready for in-memory repositories.");
  }

  return data;
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(() => {
      console.log("[Vibelearn Seeder] Seeding script completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Vibelearn Seeder] Seeding script failed:", err);
      process.exit(1);
    });
}
