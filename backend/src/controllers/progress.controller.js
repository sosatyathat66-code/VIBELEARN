import { progressService } from "../services/progress.service.js";

export const progressController = {
  /**
   * GET /api/progress
   */
  async getProgress(req, res, next) {
    try {
      const userId = req.auth?.userId;
      const progressData = await progressService.getUserProgress(userId);
      return res.status(200).json(progressData);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/progress
   */
  async saveProgress(req, res, next) {
    try {
      const userId = req.auth?.userId;
      const result = await progressService.saveUserProgress(userId, req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
