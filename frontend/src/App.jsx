import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import InterviewWorkspace from "./components/interview/InterviewWorkspace";
import ProfileMenu from "./components/layout/ProfileMenu";
import Logo from "./components/layout/Logo";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/auth/RegisterPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import { getCurrentUser } from "./services/authApi";
import { useInterviewStore } from "./store/interviewStore";
import { clearAuthToken, hasAuthToken, setAuthToken } from "./utils/authToken";
import { clearStoredAuthUser, getStoredAuthUser, setStoredAuthUser } from "./utils/authUser";

const AppLayout = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePage = useMemo(() => {
    if (location.pathname.startsWith("/dashboard")) {
      return "dashboard";
    }
    if (location.pathname.startsWith("/profile")) {
      return "profile";
    }
    if (location.pathname.startsWith("/reports")) {
      return "reports";
    }
    return "interview";
  }, [location.pathname]);

  const isInterviewRoute = location.pathname.startsWith("/interview");
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <Logo compact />
          </div>

          <ProfileMenu
            user={currentUser}
            activePage={activePage}
            onNavigate={(pageId) => {
              if (pageId === "dashboard") {
                navigate("/dashboard");
              } else if (pageId === "profile") {
                navigate("/profile");
              } else {
                navigate("/interview");
              }
            }}
            onLogout={onLogout}
          />
        </header>

        {isInterviewRoute ? (
          <InterviewWorkspace />
        ) : (
          <Outlet />
        )}

      </section>
    </main>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken());
  const [currentUser, setCurrentUser] = useState(() => getStoredAuthUser());
  const [isBootstrappingUser, setIsBootstrappingUser] = useState(hasAuthToken());
  const resetInterview = useInterviewStore((state) => state.resetInterview);

  useEffect(() => {
    const handleUnauthorized = () => {
      resetInterview();
      clearStoredAuthUser();
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [navigate, resetInterview]);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!isAuthenticated) {
        setIsBootstrappingUser(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setCurrentUser(response.data);
        setStoredAuthUser(response.data);
      } catch (error) {
        clearStoredAuthUser();
        setCurrentUser(null);
      } finally {
        setIsBootstrappingUser(false);
      }
    };

    bootstrapUser();
  }, [isAuthenticated]);

  const handleAuthSuccess = (response, redirectPath = "/interview") => {
    resetInterview();
    if (response?.token) {
      setAuthToken(response.token);
    }
    if (response?.user) {
      setStoredAuthUser(response.user);
      setCurrentUser(response.user);
    }
    setIsAuthenticated(true);
    navigate(redirectPath, { replace: true });
  };

  const handleLogout = () => {
    resetInterview();
    clearAuthToken();
    clearStoredAuthUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  if (isBootstrappingUser && hasAuthToken()) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-28 w-full max-w-md animate-pulse rounded-[32px] border border-white/10 bg-white/6" />
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/interview" replace />
          ) : (
            <LoginPage
              onNavigateToRegister={() => navigate("/register")}
              onSuccess={(response) => handleAuthSuccess(response, location.state?.from?.pathname || "/interview")}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/interview" replace />
          ) : (
            <RegisterPage
              onNavigateToLogin={() => navigate("/login")}
              onSuccess={(response) => handleAuthSuccess(response, "/interview")}
            />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout currentUser={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage user={currentUser} />} />
        <Route path="/profile" element={<ProfilePage user={currentUser} />} />
        <Route path="/interview" element={null} />
        <Route path="/reports/:reportId" element={<ReportDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/interview" : "/"} replace />} />
    </Routes>
  );
};

const App = () => <AppRoutes />;

export default App;
