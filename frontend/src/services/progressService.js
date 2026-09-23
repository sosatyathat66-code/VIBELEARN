import { apiRequest } from "./apiClient.js";

export const progressService = {
  /**
   * Fetch user progress from backend
   */
  async fetchProgress(getToken = null) {
    return apiRequest("progress", { method: "GET" }, getToken);
  },

  /**
   * Save or update lesson progress (completion and resume timestamp)
   */
  async saveProgress(payload, getToken = null) {
    return apiRequest(
      "progress",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      getToken
    );
  },
};
