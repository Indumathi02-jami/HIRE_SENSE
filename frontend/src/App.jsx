import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import InterviewWorkspace from "./components/interview/InterviewWorkspace";
import ProfileMenu from "./components/layout/ProfileMenu";
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
    <main className="min-h-screen bg-hero-grid">
      <section className={`mx-auto min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10 ${isInterviewRoute ? "max-w-7xl" : "max-w-6xl"}`}>
        <header className="mb-8 flex items-center justify-between gap-4">
          <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            HireSense AI
          </span>

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
          <div className="grid w-full gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="flex flex-col justify-center">
              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Adaptive AI mock interviews designed like a real technical screen
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Upload a resume, answer one question at a time, and let HireSense AI adapt the interview like a sharp, professional interviewer.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Adaptive follow-ups
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Focused question flow
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Detailed review reports
                </span>
              </div>
            </div>

            <InterviewWorkspace />
          </div>
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
      <main className="min-h-screen bg-hero-grid">
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
