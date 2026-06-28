const crypto = require("crypto");
const path = require("path");

const AppError = require("./AppError");

const allowedMimeTypes = ["application/pdf"];
const allowedExtensions = [".pdf"];

const sanitizeBaseName = (fileName) => {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "resume";
};

const validatePdfFile = (file) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(mimeType)) {
    throw new AppError("Only PDF resume files are allowed.", 400);
  }
};

const buildSafePdfName = (originalName) => {
  const extension = path.extname(originalName).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new AppError("Only PDF resume files are allowed.", 400);
  }

  const safeBaseName = sanitizeBaseName(originalName);
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;

  return `${safeBaseName}-${uniqueSuffix}.pdf`;
};

module.exports = {
  buildSafePdfName,
  sanitizeBaseName,
  validatePdfFile
};
