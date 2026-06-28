import { motion } from "framer-motion";

const InterviewChat = ({ currentQuestion, currentQuestionNumber, totalQuestions }) => {
  return (
    <div className="glass-card rounded-[32px] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.4)] border border-cyan-500/10 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Current Question
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Question {currentQuestionNumber} of {totalQuestions}
          </h2>
        </div>
        <div className="rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-2 text-xs font-semibold text-cyan-200">
          Adaptive flow
        </div>
      </div>

      {currentQuestion ? (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-[28px] border border-cyan-400/20 bg-cyan-500/10 p-6 text-base leading-8 text-cyan-100 shadow-[0_8px_32px_rgba(6,182,212,0.15)]"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            HireSense AI
          </p>
          {currentQuestion}
        </motion.div>
      ) : null}
    </div>
  );
};

export default InterviewChat;
