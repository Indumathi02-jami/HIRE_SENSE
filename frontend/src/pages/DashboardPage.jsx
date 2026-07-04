import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  BarElement,
  CategoryScale
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import DashboardChartCard from "../components/dashboard/DashboardChartCard";
import DashboardStatCard from "../components/dashboard/DashboardStatCard";
import { getDashboardInterviews, getDashboardStats } from "../services/dashboardApi";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend, BarElement);

const sharedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#cbd5e1"
      }
    },
    tooltip: {
      backgroundColor: "rgba(2, 6, 23, 0.92)",
      borderColor: "rgba(148, 163, 184, 0.18)",
      borderWidth: 1,
      titleColor: "#f8fafc",
      bodyColor: "#cbd5e1"
    }
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" }
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" }
    }
  }
};

const formatSkillLabel = (label = "") =>
  label.length > 18 ? `${label.slice(0, 18)}...` : label;

const DashboardPage = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [statsResponse, interviewsResponse] = await Promise.all([
          getDashboardStats(),
          getDashboardInterviews()
        ]);

        setStats(statsResponse.data);
        setInterviews(interviewsResponse.data);
      } catch (dashboardError) {
        setError(dashboardError.message || "Unable to load dashboard analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const communicationPercent = Math.min(
    100,
    Math.round((stats?.averageCommunicationScore || 0) * 10)
  );

  const communicationChartData = useMemo(
    () => ({
      labels: ["Communication Score", "Remaining"],
      datasets: [
        {
          data: [communicationPercent, Math.max(0, 100 - communicationPercent)],
          backgroundColor: ["#22c55e", "rgba(15, 23, 42, 0.72)"],
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    }),
    [communicationPercent]
  );

  const skillsChartData = useMemo(
    () => ({
      labels: stats?.strongestSkills?.slice(0, 4).map((item) => formatSkillLabel(item.skill)) || [],
      datasets: [
        {
          label: "Top Skill Score",
          data: stats?.strongestSkills?.slice(0, 4).map((item) => item.averageScore) || [],
          backgroundColor: "rgba(56, 189, 248, 0.72)",
          borderRadius: 12,
          barThickness: 18,
          maxBarThickness: 20,
          borderSkipped: false
        }
      ]
    }),
    [stats]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`stat-skeleton-${index}`}
              className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/6"
            />
          ))}
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 h-[280px] animate-pulse" />
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`chart-skeleton-${index}`}
              className="h-[420px] animate-pulse rounded-[30px] border border-white/10 bg-white/6"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-rose-400/18 bg-rose-500/10 p-6 text-rose-100 backdrop-blur-2xl">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="clay-card rounded-[32px] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.26)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Analytics Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Hello, {user?.fullName || "there"} 👋
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Review interview performance, communication growth, and skill trends from real HireSense AI sessions.
            </p>
          </div>
          <div className="rounded-3xl px-5 py-4 text-sm text-cyan-200 clay-badge">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Workspace Member</p>
            <p className="mt-2 font-medium">{user?.email}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Total Interviews"
          value={stats?.totalInterviews || 0}
          detail="Session volume"
          accent="bg-cyan-500/10 text-cyan-200 border-cyan-500/20"
        />
        <DashboardStatCard
          label="Completed"
          value={stats?.completedInterviews || 0}
          detail="Finished runs"
          accent="bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
        />
        <DashboardStatCard
          label="Average Score"
          value={stats?.averageScore || 0}
          detail="/10 overall"
          accent="bg-amber-500/10 text-amber-200 border-amber-500/20"
        />
        <DashboardStatCard
          label="Success Rate"
          value={`${stats?.successRate || 0}%`}
          detail={`${stats?.averageCommunicationScore || 0} comms avg`}
          accent="bg-violet-500/10 text-violet-200 border-violet-500/20"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardChartCard
          title="Communication Performance"
          subtitle="A focused view of communication strength across completed interview sessions."
          className="h-[440px]"
        >
          <div className="relative mx-auto flex h-[340px] w-full max-w-[360px] items-center justify-center">
            <Pie
              data={communicationChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 760 },
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#cbd5e1",
                      padding: 18,
                      usePointStyle: true,
                      pointStyle: "circle"
                    }
                  },
                  tooltip: {
                    backgroundColor: "rgba(2, 6, 23, 0.92)",
                    borderColor: "rgba(148, 163, 184, 0.18)",
                    borderWidth: 1,
                    titleColor: "#f8fafc",
                    bodyColor: "#cbd5e1"
                  }
                }
              }}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-extrabold text-white">{communicationPercent}%</p>
              <p className="mt-2 text-sm uppercase tracking-[0.28em] text-slate-400">
                Communication
              </p>
            </div>
          </div>
          <div className="mt-3 text-center text-sm leading-6 text-slate-400">
            Speaking pace, hesitation, filler words, and confidence indicators combined into one clear communication score.
          </div>
        </DashboardChartCard>

        <DashboardChartCard
          title="Strongest Skills"
          subtitle="Top-performing skills only, shown as a cleaner horizontal bar chart."
          className="h-[360px]"
        >
          <Bar
            data={skillsChartData}
            options={{
              ...sharedChartOptions,
              indexAxis: "y",
              animation: { duration: 760 },
              plugins: {
                ...sharedChartOptions.plugins,
                legend: {
                  display: false
                }
              },
              layout: {
                padding: {
                  top: 6,
                  bottom: 6,
                  right: 10
                }
              },
              scales: {
                x: {
                  ticks: { color: "#94a3b8" },
                  grid: { color: "rgba(148,163,184,0.08)" },
                  suggestedMax: 10,
                  beginAtZero: true
                },
                y: {
                  ticks: { color: "#e2e8f0", font: { size: 11 } },
                  grid: { display: false }
                }
              }
            }}
          />
        </DashboardChartCard>
      </section>

      <DashboardChartCard
        title="Interview History"
        subtitle="Recent interview sessions for the authenticated user only."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate-400">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Domain</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Communication</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-sm text-slate-200">
              {interviews.map((item) => (
                <tr key={item.sessionId} className="transition hover:bg-cyan-500/[0.04] border-b border-white/5">
                  <td className="py-4 pr-4">{item.dateLabel}</td>
                  <td className="py-4 pr-4">{item.domain}</td>
                  <td className="py-4 pr-4">{item.score}/10</td>
                  <td className="py-4 pr-4">{item.communicationScore}/10</td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                        item.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-200 border-amber-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    {item.reportId ? (
                      <Link
                        to={`/reports/${item.reportId}`}
                        className="rounded-full clay-btn-secondary px-4 py-2 text-xs font-semibold text-cyan-200 transition-all duration-200 hover:scale-[1.02]"
                      >
                        View Report
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardChartCard>

    </motion.div>
  );
};

export default DashboardPage;
