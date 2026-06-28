import ResumeCard from "./ResumeCard";
import LoadingSkeleton from "./LoadingSkeleton";

const ResumeHistory = ({ resumes, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100 backdrop-blur-xl">
        {error}
      </div>
    );
  }

  if (!resumes.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300 backdrop-blur-xl">
        No resumes uploaded yet. Your latest candidate uploads will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <ResumeCard key={resume._id} resume={resume} />
      ))}
    </div>
  );
};

export default ResumeHistory;
