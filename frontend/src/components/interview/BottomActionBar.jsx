import { motion } from "framer-motion";
import { ArrowLeft, Save, SkipForward, Send } from "lucide-react";

const BottomActionBar = ({
  onSubmit,
  onEndInterview,
  onSkipQuestion,
  isSubmitting,
  autoSubmitEnabled,
  onToggleAutoSubmit,
  answerLength
}) => {
  const canSubmit = answerLength > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="fixed bottom-0 left-0 right-0 border-t border-slate-700/50 bg-slate-950/90 backdrop-blur-md z-40"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEndInterview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">End</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkipQuestion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden sm:inline">Skip</span>
            </motion.button>
          </div>

          {/* Center - Auto Submit Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">Auto-submit:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSubmitEnabled}
                onChange={(e) => onToggleAutoSubmit(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-checked:bg-cyan-600/40 rounded-full transition-colors" />
              <span className="absolute left-1 top-1 w-4 h-4 bg-slate-300 peer-checked:bg-cyan-300 rounded-full transition-all peer-checked:translate-x-5" />
            </label>
          </div>

          {/* Right - Submit Button */}
          <motion.button
            whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
            onClick={onSubmit}
            disabled={isSubmitting || !canSubmit}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
              canSubmit && !isSubmitting
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60"
                : "bg-slate-700/50 opacity-60 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="w-4 h-4" />
                </motion.span>
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Answer</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomActionBar;
