/**
 * Centralized API Client for Vibelearn
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getDevUserId() {
  try {
    let id = localStorage.getItem("vibelearn_user_id");
    if (!id) {
      id = "learner-user-1";
      localStorage.setItem("vibelearn_user_id", id);
    }
    return id;
  } catch {
    return "learner-user-1";
  }
}

/**
 * Universal request wrapper for REST API endpoints
 */
export async function apiRequest(endpoint, options = {}, getToken = null) {
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 1. If getToken function is provided, try to obtain real Clerk JWT
  let token = null;
  if (typeof getToken === "function") {
    try {
      token = await getToken();
    } catch (err) {
      console.warn("[ApiClient] Could not retrieve Clerk token:", err);
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // 2. Attach dev user ID header so progress endpoints work in local dev
    headers["x-user-id"] = getDevUserId();
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON safely
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || data.error || `HTTP error ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[ApiClient Error] ${options.method || "GET"} ${url}:`, error.message);
    throw error;
  }
}
