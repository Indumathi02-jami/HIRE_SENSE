const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Account created successfully.",
    data: result
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Signed in successfully.",
    data: result
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: "User profile fetched successfully.",
    data: result
  });
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
