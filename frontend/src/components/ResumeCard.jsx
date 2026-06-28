import { formatFileSizeMB, formatUploadDate } from "../utils/formatters";

const ResumeCard = ({ resume }) => {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/80">
            Resume
          </p>
          <h3 className="mt-2 break-words text-lg font-semibold text-white">
            {resume.originalName}
          </h3>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
          PDF
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">File Size</p>
          <p className="mt-1 font-medium text-white">{formatFileSizeMB(resume.fileSize)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Uploaded</p>
          <p className="mt-1 font-medium text-white">{formatUploadDate(resume.uploadDate)}</p>
        </div>
      </div>
    </article>
  );
};

export default ResumeCard;
