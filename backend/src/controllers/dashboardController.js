const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardStats(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Dashboard stats fetched successfully.",
    data: result
  });
});

const getDashboardInterviews = asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardInterviews(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Interview history fetched successfully.",
    data: result
  });
});

const getDashboardTrends = asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardTrends(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Dashboard trends fetched successfully.",
    data: result
  });
});

module.exports = {
  getDashboardStats,
  getDashboardInterviews,
  getDashboardTrends
};
