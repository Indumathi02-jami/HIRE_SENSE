import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";

const AIInterviewerPanel = ({
  currentQuestion,
  currentQuestionNumber,
  totalQuestions,
  qaHistory,
  difficulty
}) => {
  const answerCount = qaHistory.filter((q) => q.answer?.trim()).length;
  const showHistory = answerCount > 0;

  const difficultyColor = {
    Beginner: "text-emerald-300",
    Intermediate: "text-amber-300",
    Advanced: "text-rose-300"
  }[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full gap-4"
    >
      {/* Main Question Card */}
      <motion.div
        key={`question-${currentQuestionNumber}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 lg:p-7 hover:border-cyan-400/30 transition-all duration-300"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex-shrink-0"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div>
                <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">AI Interviewer</p>
                <p className="text-xs text-slate-400 mt-0.5">Question {currentQuestionNumber} of {totalQuestions}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor} bg-white/5 border border-current/20`}>
              {difficulty}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <p className="text-base lg:text-lg leading-relaxed text-slate-50 font-medium">
              {currentQuestion}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 pt-5 border-t border-slate-700/30">
            <div className="text-xs text-slate-400">
              <span className="text-cyan-300 font-semibold">Estimated time:</span> 3 minutes
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-cyan-300 font-semibold">Focus:</span> Technical depth & clarity
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conversation History - Collapsible */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-slate-700/30 bg-slate-900/30 p-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-300">Previous Questions</h4>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
              {answerCount}
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {qaHistory.slice(0, -1).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-all"
              >
                <p className="text-xs text-slate-400 font-medium mb-1">Q{idx + 1}</p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.question}</p>
                {item.score && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-700/30 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      />
                    </div>
                    <span className="text-xs font-semibold text-emerald-300">{Math.round(item.score)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIInterviewerPanel;
