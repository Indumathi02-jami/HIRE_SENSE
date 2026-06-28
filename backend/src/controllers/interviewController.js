const interviewService = require("../services/interviewService");
const resumeAnalysisService = require("../services/resumeAnalysisService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { signResumeAnalysisToken } = require("../utils/resumeAnalysisToken");

const analyzeResume = asyncHandler(async (req, res) => {
  const result = await resumeAnalysisService.analyzeResumeForInterview(req.file);
  const analysisToken = signResumeAnalysisToken({
    originalName: result.originalName,
    resumeProfile: result.resumeProfile
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: "Resume analyzed successfully.",
    data: {
      ...result,
      analysisToken
    }
  });
});

const startInterview = asyncHandler(async (req, res) => {
  const result = await interviewService.startInterview({
    userId: req.user.id,
    configuration: req.body
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Interview session started successfully.",
    data: result
  });
});

const submitAnswer = asyncHandler(async (req, res) => {
  const result = await interviewService.submitAnswer({
    userId: req.user.id,
    sessionId: req.body.sessionId,
    answer: req.body.answer,
    timeTaken: req.body.timeTaken,
    communicationInput: req.body.communicationInput
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: "Answer evaluated successfully.",
    data: result
  });
});

const endInterview = asyncHandler(async (req, res) => {
  const result = await interviewService.endInterview({
    userId: req.user.id,
    sessionId: req.body.sessionId
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: "Interview completed successfully.",
    data: result
  });
});

const getReport = asyncHandler(async (req, res) => {
  const result = await interviewService.getReportBySessionId({
    userId: req.user.id,
    reportId: req.params.reportId
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: "Interview report fetched successfully.",
    data: result
  });
});

module.exports = {
  analyzeResume,
  startInterview,
  submitAnswer,
  endInterview,
  getReport
};
