const analysisService = require("../services/analysisService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const analyzeResume = asyncHandler(async (req, res) => {
  const result = await analysisService.analyzeResumeFile(req.file);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Resume analyzed successfully.",
    data: result
  });
});

module.exports = {
  analyzeResume
};
