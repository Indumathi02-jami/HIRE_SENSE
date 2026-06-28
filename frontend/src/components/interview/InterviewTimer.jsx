import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const QUESTION_DURATION_SECONDS = 180;
const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (secondsRemaining) => {
  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsRemaining % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const InterviewTimer = ({ timerKey, isRunning, autoSubmitEnabled, onExpire }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(QUESTION_DURATION_SECONDS);

  useEffect(() => {
    setSecondsRemaining(QUESTION_DURATION_SECONDS);
  }, [timerKey]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    if (secondsRemaining <= 0) {
      onExpire?.();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [secondsRemaining, isRunning, onExpire]);

  const progress = useMemo(
    () => secondsRemaining / QUESTION_DURATION_SECONDS,
    [secondsRemaining]
  );
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = secondsRemaining <= 30;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            stroke="rgba(148, 163, 184, 0.18)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={RADIUS}
            stroke={isUrgent ? "#fb7185" : "#38bdf8"}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {formatTime(secondsRemaining)}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">Timer</p>
        <p className="mt-1 text-sm text-slate-200">
          {autoSubmitEnabled
            ? "Auto-submit is enabled when time expires."
            : "Auto-submit is disabled. You can keep refining until you submit."}
        </p>
      </div>
    </div>
  );
};

export default InterviewTimer;
