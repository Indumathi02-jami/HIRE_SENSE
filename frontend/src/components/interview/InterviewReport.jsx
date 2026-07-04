import { motion, useReducedMotion } from "framer-motion";

const ReviewCard = ({ entry, index }) => (
  <div className="clay-card rounded-[28px] p-6 shadow-lg">
    <div className="mb-4 flex items-center justify-between gap-4">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
        Question {index + 1}
      </p>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          entry.answerReview?.isCorrect
            ? "clay-badge-emerald text-emerald-200"
            : "clay-badge text-cyan-200"
        }`}
      >
        {entry.answerReview?.isCorrect ? "Correct" : "Needs Improvement"}
      </span>
    </div>

    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Question Asked</p>
        <p className="mt-2 text-sm leading-7 text-white">{entry.question}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">My Answer</p>
        <p className="mt-2 text-sm leading-7 text-slate-200">{entry.answer || "No answer recorded."}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">AI Evaluation</p>
        <div className="mt-2 rounded-2xl clay-input px-4 py-4">
          <p className="text-sm leading-7 text-slate-200">{entry.aiFeedback}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            <span className="font-semibold text-white">What was good:</span>{" "}
            {entry.answerReview?.whatWasGood || "The answer showed some relevant direction."}
          </p>
          <div className="mt-3">
            <p className="text-sm font-semibold text-white">Missing concepts</p>
            {entry.answerReview?.missingConcepts?.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {entry.answerReview.missingConcepts.map((item) => (
                  <li key={`${entry.question}-${item}`} className="rounded-xl px-3 py-2 text-rose-200 clay-badge-rose">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-400">No major missing concepts were identified.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Correct Structured Answer</p>
        <div className="mt-2 rounded-2xl clay-card px-5 py-4 text-sm leading-7 text-cyan-100 shadow-[0_8px_30px_rgba(6,182,212,0.15)]">
          {entry.answerReview?.idealAnswer || "A stronger structured answer was not available for this question."}
        </div>
      </div>
    </div>
  </div>
);

const InterviewReport = ({ session, onReset, actionLabel = "Start another interview" }) => {
  const prefersReducedMotion = useReducedMotion();
  const reviewedEntries = (session?.qaHistory || []).filter((entry) => entry.answer?.trim());

  return (
    <motion.section
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.18 : 0.35 }}
      className="mx-auto w-full max-w-6xl space-y-6 rounded-[32px] clay-card p-6 shadow-lg sm:p-7 lg:p-8"
    >
      {onReset ? (
        <div className="flex justify-start">
          <motion.button
            type="button"
            onClick={onReset}
            whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl clay-btn px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.25)] hover:shadow-glow-cyan transition duration-200 hover:scale-[1.01]"
          >
            {actionLabel}
          </motion.button>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] clay-card p-6 shadow-[0_22px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Interview Summary</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Detailed interview review</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">{session.finalReport}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[28px] clay-card px-6 py-5 text-center shadow-[0_18px_45px_rgba(34,211,238,0.15)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Overall Score</p>
            <p className="mt-2 text-4xl font-extrabold text-white">{session.overallScore ?? 0}</p>
            <p className="text-sm text-cyan-200/80">out of 10</p>
          </div>

          <div className="rounded-[28px] clay-card px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Questions Reviewed</p>
            <p className="mt-2 text-2xl font-bold text-white">{reviewedEntries.length}</p>
          </div>

          <div className="rounded-[28px] clay-card px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Communication Score</p>
            <p className="mt-2 text-2xl font-bold text-white">{session.communicationReport?.communicationScore ?? 0}/10</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviewedEntries.map((entry, index) => (
          <ReviewCard key={`${entry.question}-${index}`} entry={entry} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default InterviewReport;
