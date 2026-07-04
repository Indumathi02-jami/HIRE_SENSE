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
    <div className="interview-inner-card flex items-center gap-4 rounded-[18px] px-4 py-3 transition-all duration-300 hover:border-cyan-200/30">
      <div className="relative h-16 w-16 shrink-0 rounded-full bg-slate-950/45 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
        <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90 drop-shadow-[0_0_8px_rgba(56,189,248,0.12)]">
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            stroke="rgba(148, 163, 184, 0.16)"
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
        <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-slate-50">
          {formatTime(secondsRemaining)}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Timer</p>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
          {autoSubmitEnabled
            ? "Auto-submit will submit when time expires."
            : "Auto-submit is off — you must submit manually."}
        </p>
      </div>
    </div>
  );
};

export default InterviewTimer;
