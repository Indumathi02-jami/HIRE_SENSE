const resumeService = require("../services/resumeService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.createResumeRecord(req.file, req.user.id);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Resume uploaded successfully.",
    data: resume
  });
});

const getResumeHistory = asyncHandler(async (req, res) => {
  // History must be filtered by the authenticated user on the server.
  // Client-side filtering is not secure because requests can be forged.
  const resumes = await resumeService.getResumeHistory(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Resume history fetched successfully.",
    data: resumes
  });
});

module.exports = {
  uploadResume,
  getResumeHistory
};
