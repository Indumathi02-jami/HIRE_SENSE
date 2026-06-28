import { motion } from "framer-motion";

const difficulties = ["Beginner", "Intermediate", "Advanced"];
const interviewTypes = ["Technical", "Behavioral", "System Design", "Mixed"];

const SelectField = ({ label, value, options, onChange }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 hover:border-cyan-300/25 focus:border-cyan-400/40 focus:shadow-[0_0_15px_rgba(34,211,238,0.12)] px-4 text-sm text-white outline-none transition-all duration-300"
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-slate-950 text-white">
          {option}
        </option>
      ))}
    </select>
  </label>
);

const InterviewConfigurator = ({
  configuration,
  resumeAnalysis,
  isAnalyzing,
  isStarting,
  uploadProgress,
  onChange,
  onResumeSelect,
  onStart
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-[32px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-cyan-500/10 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
        Interview Setup
      </p>
      <h2 className="mt-3 text-3xl font-bold text-white">Let AI understand the candidate first</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Upload a resume, let HireSense AI detect the strongest stack automatically, then start a personalized interview.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Resume PDF</span>
          <div className="rounded-2xl border border-dashed border-cyan-500/20 bg-slate-950/40 p-6 text-center transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-950/60 hover:shadow-glow-cyan/5">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              id="resume-upload"
              onChange={(event) => onResumeSelect(event.target.files?.[0])}
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="mx-auto mb-3 inline-block rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition-all duration-200 hover:scale-[1.01] hover:shadow-glow-cyan/10">
                Upload resume for AI analysis
              </div>
              <p className="text-sm text-slate-300">
                The AI will infer the tech stack, strongest skills, and likely interview focus automatically.
              </p>
            </label>
          </div>
        </label>

        {isAnalyzing ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5 text-sm text-cyan-50 shadow-[0_10px_35px_rgba(6,182,212,0.15)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Analyzing Resume
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-500"
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>
        ) : null}

        {resumeAnalysis?.resumeProfile ? (
          <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Detected Stack
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {resumeAnalysis.resumeProfile.primaryDomain}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {resumeAnalysis.resumeProfile.interviewFocus}
                </p>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                {resumeAnalysis.resumeProfile.experienceLevel}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[...resumeAnalysis.resumeProfile.technologies, ...resumeAnalysis.resumeProfile.frameworks]
                .slice(0, 10)
                .map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1.5 text-xs font-semibold text-cyan-200/90"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Difficulty"
          value={configuration.difficulty}
          options={difficulties}
          onChange={(value) => onChange({ difficulty: value })}
        />
        <SelectField
          label="Interview Type"
          value={configuration.interviewType}
          options={interviewTypes}
          onChange={(value) => onChange({ interviewType: value })}
        />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.18 }}
          onClick={onStart}
          disabled={isStarting || !resumeAnalysis?.resumeProfile}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-6 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.25)] hover:shadow-glow-cyan transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isStarting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
              <span>Starting interview...</span>
            </>
          ) : (
            "Start interview"
          )}
        </motion.button>

        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          5 adaptive questions personalized from the resume
        </span>
      </div>
    </motion.section>
  );
};

export default InterviewConfigurator;
