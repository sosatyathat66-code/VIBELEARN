/**
 * Centralized error-handling middleware for Express
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
