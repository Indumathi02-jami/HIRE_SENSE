const multer = require("multer");

const { sendError } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";
  let errorDetails;

  if (error instanceof multer.MulterError) {
    statusCode = 400;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "Resume file must be 5MB or smaller.";
    } else {
      message = "Unable to process the uploaded file.";
    }
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    errorDetails = Object.values(error.errors).map((item) => item.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A resume with the same stored name already exists.";
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please sign in again."
        : "Invalid authentication token.";
  }

  // Handle rate limit errors specifically
  if (statusCode === 429) {
    statusCode = 429; // Keep as 429 instead of converting to 500
    message = message || "Too many requests. Please try again later.";
  }

  return sendError(res, {
    statusCode,
    message,
    error: errorDetails || (process.env.NODE_ENV === "production" ? undefined : error.message)
  });
};

module.exports = {
  notFoundMiddleware,
  errorHandler
};
