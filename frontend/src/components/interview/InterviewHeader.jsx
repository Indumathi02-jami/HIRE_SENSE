import { motion } from "framer-motion";
import { Clock, Zap, Award } from "lucide-react";

const InterviewHeader = ({
  sessionId,
  currentQuestionNumber,
  totalQuestions,
  difficulty,
  candidateName,
  onEndInterview,
  isEnding
}) => {
  const progressPercentage = Math.round((currentQuestionNumber / totalQuestions) * 100);

  const difficultyConfig = {
    Beginner: { bg: "bg-emerald-500/10", text: "text-emerald-300", badge: "bg-emerald-500/20" },
    Intermediate: { bg: "bg-amber-500/10", text: "text-amber-300", badge: "bg-amber-500/20" },
    Advanced: { bg: "bg-rose-500/10", text: "text-rose-300", badge: "bg-rose-500/20" }
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.Intermediate;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Title & Progress */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-col gap-1">
              <h1 className="text-sm font-bold text-slate-100">
                HireSense AI Interview
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Question {currentQuestionNumber} of {totalQuestions}</span>
                <span className="text-slate-600">•</span>
                <span>{progressPercentage}% Complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs ml-4">
              <div className="flex-1 h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/20"
                />
              </div>
            </div>
          </div>

          {/* Center Section - Badges */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.badge} ${config.text} border border-current/20`}
            >
              <Zap className="w-3 h-3" />
              {difficulty}
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Award className="w-3 h-3" />
              Adaptive
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEndInterview}
              disabled={isEnding}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnding ? "Ending..." : "End"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewHeader;
