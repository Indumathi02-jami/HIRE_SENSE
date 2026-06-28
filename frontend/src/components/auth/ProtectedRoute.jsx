import { Navigate, useLocation } from "react-router-dom";

import { hasAuthToken } from "../../utils/authToken";

const ProtectedRoute = ({ isAuthenticated, fallback = null, children, redirectTo = "/login" }) => {
  const allowed = typeof isAuthenticated === "boolean" ? isAuthenticated : hasAuthToken();
  const location = useLocation();

  // Protected routes keep private screens from rendering unless the user
  // has a valid auth state. This avoids exposing private UI paths by URL alone.
  if (!allowed) {
    return fallback ?? <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
