import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import InterviewReport from "../components/interview/InterviewReport";
import { getInterviewReport } from "../services/interviewApi";
import { useInterviewStore } from "../store/interviewStore";

const ReportDetailsPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const resetInterview = useInterviewStore((state) => state.resetInterview);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await getInterviewReport(reportId);
        setSession(response.data.session);
      } catch (reportError) {
        setError(reportError.message || "Unable to load the report.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  if (isLoading) {
    return <div className="h-[220px] animate-pulse rounded-[32px] border border-white/10 bg-white/6" />;
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-rose-400/18 bg-rose-500/10 p-6 text-rose-100 backdrop-blur-2xl">
        {error}
      </div>
    );
  }

  return (
    <InterviewReport
      session={session}
      onReset={() => {
        resetInterview();
        navigate("/interview");
      }}
      actionLabel="Start new interview"
    />
  );
};

export default ReportDetailsPage;
