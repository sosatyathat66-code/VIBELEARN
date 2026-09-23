import { createClerkClient } from "@clerk/backend";
import { env } from "../config/env.js";

let clerkClient = null;
if (env.CLERK_SECRET_KEY && !env.CLERK_SECRET_KEY.includes("your_clerk_secret_key")) {
  try {
    clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  } catch (err) {
    console.warn("[AuthMiddleware] Failed to initialize Clerk client:", err.message);
  }
}

/**
 * Clerk Authentication Middleware
 * Enforces authentication on protected routes (e.g., /api/progress)
 */
export async function requireAuth(req, res, next) {
  try {
    // 1. Check for Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Allow dev/test fallback header (x-user-id) if in development or test mode
    const devUserId = req.headers["x-user-id"];
    if (devUserId && (env.NODE_ENV === "development" || env.NODE_ENV === "test" || !clerkClient)) {
      req.auth = { userId: devUserId };
      return next();
    }

    // 3. If live Clerk client exists and token is provided, verify JWT
    if (clerkClient && token) {
      try {
        if (typeof clerkClient.verifyToken === "function") {
          const verified = await clerkClient.verifyToken(token);
          if (verified && (verified.sub || verified.userId)) {
            req.auth = { userId: verified.sub || verified.userId };
            return next();
          }
        }
      } catch (tokenErr) {
        // Fall back to authenticateRequest if verifyToken failed
        try {
          const decoded = await clerkClient.authenticateRequest(req);
          if (decoded && decoded.isSignedIn()) {
            const authObj = decoded.toAuth();
            req.auth = { userId: authObj.userId };
            return next();
          }
        } catch (authErr) {
          console.warn("[AuthMiddleware] Clerk verification failed:", authErr.message || tokenErr.message);
        }
      }
    }

    // 4. If Bearer token is provided in dev mode without live secret key, allow test token
    if (token && (env.NODE_ENV === "development" || !clerkClient)) {
      req.auth = { userId: token.startsWith("user_") ? token : "dev-user-default" };
      return next();
    }

    // 5. Unauthorized if no valid credentials found
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required to access this resource",
    });
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: error.message || "Failed to authenticate request",
    });
  }
}
