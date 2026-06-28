const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const AppError = require("../utils/AppError");

const extractBearerToken = (authorizationHeader = "") => {
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const protect = (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new AppError("Authentication required. Please sign in.", 401));
  }

  try {
    // JWT authorization works by verifying the signed token on the backend
    // and trusting only the verified payload, never a user id from the client body.
    const decoded = jwt.verify(token, env.jwtSecret);

    if (!decoded?.id) {
      return next(new AppError("Invalid authentication token.", 401));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  protect
};
