import { motion } from "framer-motion";

const InterviewChat = ({ currentQuestion, currentQuestionNumber, totalQuestions }) => {
  return (
    <div className="interview-glass-card rounded-[18px] p-5 transition-all duration-300 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Current Question
          </p>
          <h2 className="mt-2 text-xl font-extrabold leading-tight text-slate-50">
            Question {currentQuestionNumber} of {totalQuestions}
          </h2>
        </div>
        <div className="interview-pill rounded-full px-3 py-1 text-xs font-semibold text-cyan-100">
          Adaptive flow
        </div>
      </div>

      {currentQuestion ? (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="interview-inner-card rounded-[16px] p-5 text-base font-medium leading-7 text-cyan-50 transition-all duration-300 hover:border-cyan-200/30 hover:shadow-[0_16px_40px_rgba(6,182,212,0.08)]"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">
            HireSense AI
          </p>
          {currentQuestion}
        </motion.div>
      ) : null}
    </div>
  );
};

export default InterviewChat;
