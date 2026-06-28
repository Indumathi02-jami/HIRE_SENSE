const UploadProgress = ({ progress, isComplete }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
        <span>{isComplete ? "Upload complete" : "Uploading resume"}</span>
        <span className="font-semibold text-white">{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800/80">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? "bg-emerald-400" : "bg-gradient-to-r from-cyan-400 to-blue-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
