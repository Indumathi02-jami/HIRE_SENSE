const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const AppError = require("./AppError");

const ANALYSIS_TOKEN_EXPIRY = "30m";

const signResumeAnalysisToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: ANALYSIS_TOKEN_EXPIRY
  });

const verifyResumeAnalysisToken = (token) => {
  if (!token) {
    throw new AppError("Please analyze a resume before starting the interview.", 400);
  }

  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new AppError(
      "Your resume analysis session has expired. Please upload the resume again.",
      401
    );
  }
};

module.exports = {
  signResumeAnalysisToken,
  verifyResumeAnalysisToken
};
