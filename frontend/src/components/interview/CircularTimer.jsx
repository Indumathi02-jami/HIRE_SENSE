import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

const QUESTION_DURATION_SECONDS = 180;
const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const CircularTimer = ({ timerKey, isRunning, autoSubmitEnabled, onExpire }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(QUESTION_DURATION_SECONDS);

  useEffect(() => {
    setSecondsRemaining(QUESTION_DURATION_SECONDS);
  }, [timerKey]);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) {
      if (secondsRemaining <= 0) {
        onExpire?.();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, isRunning, onExpire]);

  const progress = useMemo(
    () => secondsRemaining / QUESTION_DURATION_SECONDS,
    [secondsRemaining]
  );

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = secondsRemaining <= 30;
  const isWarning = secondsRemaining <= 60 && secondsRemaining > 30;

  const strokeColor = isUrgent ? "#fb7185" : isWarning ? "#fbbf24" : "#38bdf8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-6"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Circular Timer */}
        <div className="relative">
          <motion.svg
            viewBox="0 0 120 120"
            className="w-32 h-32 -rotate-90 drop-shadow-lg"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="6"
            />

            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                filter: isUrgent ? `drop-shadow(0 0 8px ${strokeColor})` : "none",
              }}
            />
          </motion.svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={secondsRemaining}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-center ${
                isUrgent ? "text-rose-300" : isWarning ? "text-amber-300" : "text-cyan-300"
              }`}
            >
              <p className="text-3xl font-black">{formatTime(secondsRemaining)}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">remaining</p>
            </motion.div>
          </div>
        </div>

        {/* Status Info */}
        <div className="w-full text-center">
          <p className="text-xs font-medium text-slate-300 mb-2">
            {isUrgent ? (
              <span className="text-rose-300 font-semibold">⏰ Final 30 seconds</span>
            ) : isWarning ? (
              <span className="text-amber-300 font-semibold">⚠️ 1 minute remaining</span>
            ) : (
              <span className="text-cyan-300">Time remaining for this question</span>
            )}
          </p>
          {autoSubmitEnabled && (
            <p className="text-xs text-slate-400 mt-1">
              Will auto-submit when time expires
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CircularTimer;
