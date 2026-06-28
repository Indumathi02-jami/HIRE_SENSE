const path = require("path");

const Resume = require("../models/Resume");

const createResumeRecord = async (file, userId) => {
  const resume = await Resume.create({
    // Every resume is stored with its owner so queries can be scoped on the backend.
    // This prevents one authenticated user from reading another user's data.
    user: userId,
    originalName: file.originalname,
    fileName: file.filename,
    filePath: path.posix.join("/uploads/resumes", file.filename),
    fileSize: file.size,
    uploadDate: new Date()
  });

  return resume;
};

const getResumeHistory = async (userId) => {
  return Resume.find({ user: userId }).sort({ uploadDate: -1 }).lean();
};

module.exports = {
  createResumeRecord,
  getResumeHistory
};
