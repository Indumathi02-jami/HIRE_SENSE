const multer = require("multer");

const AppError = require("../utils/AppError");
const { validatePdfFile } = require("../utils/fileHelpers");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    // The backend validates both MIME type and file extension because
    // frontend checks can be bypassed and neither input should be trusted alone.
    validatePdfFile(file);
    cb(null, true);
  } catch (error) {
    cb(error);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("resume");

const handleResumeUpload = (req, res, next) => {
  uploadResume(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (!req.file) {
      return next(new AppError("Please upload a PDF resume file.", 400));
    }

    return next();
  });
};

module.exports = {
  handleResumeUpload
};
