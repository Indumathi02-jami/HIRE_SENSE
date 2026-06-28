const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { hashPassword, verifyPassword } = require("../utils/password");

const buildTokenPayload = (user) => ({
  id: user._id.toString(),
  email: user.email
});

const signAccessToken = (user) => {
  return jwt.sign(buildTokenPayload(user), env.jwtSecret, {
    expiresIn: "1d"
  });
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email
});

const registerUser = async ({ fullName, email, password }) => {
  if (!fullName?.trim()) {
    throw new AppError("Full name is required.", 400);
  }

  if (!email?.trim()) {
    throw new AppError("Email is required.", 400);
  }

  if (!password || password.length < 8) {
    throw new AppError("Password must be at least 8 characters.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashPassword(password)
  });

  return {
    user: sanitizeUser(user),
    token: signAccessToken(user)
  };
};

const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !verifyPassword(password, user.password)) {
    throw new AppError("Invalid email or password.", 401);
  }

  return {
    user: sanitizeUser(user),
    token: signAccessToken(user)
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Authenticated user could not be found.", 404);
  }

  return sanitizeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
