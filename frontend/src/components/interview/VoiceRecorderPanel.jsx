import { motion } from "framer-motion";

const WaveformBars = ({ bars = [] }) => (
  <div className="flex h-16 items-center gap-1.5 rounded-[14px] bg-slate-900/18 px-2">
    {bars.map((bar, index) => (
      <motion.span
        key={`bar-${index}`}
        animate={{ height: `${Math.max(6, bar)}px` }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-2 rounded-full bg-gradient-to-t from-cyan-500 via-sky-300 to-cyan-100 shadow-[0_0_8px_rgba(56,189,248,0.25)]"
      />
    ))}
  </div>
);

const CONFIDENCE_RADIUS = 36;
const CONFIDENCE_CIRCUMFERENCE = 2 * Math.PI * CONFIDENCE_RADIUS;

const ConfidenceMeter = ({ value = 0 }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.26em] text-slate-300">
      <span>Confidence Meter</span>
      <span className="text-cyan-100">{value}%</span>
    </div>
    <div className="flex justify-center">
      <div className="relative h-28 w-28 rounded-full bg-slate-950/35 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
        <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={CONFIDENCE_RADIUS}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth="10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={CONFIDENCE_RADIUS}
            fill="none"
            stroke="url(#confidenceGradient)"
            strokeLinecap="round"
            strokeWidth="10"
            strokeDasharray={CONFIDENCE_CIRCUMFERENCE}
            animate={{
              strokeDashoffset: CONFIDENCE_CIRCUMFERENCE * (1 - Math.min(value, 100) / 100)
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-white">
          {value}%
        </div>
      </div>
    </div>
  </div>
);

const VoiceRecorderPanel = ({
  isSupported,
  isRecording,
  isSpeechActive,
  bars,
  pauseCount,
  liveConfidence,
  onStart,
  onStop
}) => {
  return (
    <div className="interview-inner-card space-y-5 rounded-[20px] p-5 transition-all duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">
            Voice Response
          </p>
          <h4 className="mt-3 text-lg font-extrabold text-white">Speak your answer naturally</h4>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.18 }}
          onClick={isRecording ? onStop : onStart}
          disabled={!isSupported}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-[14px] px-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.01] ${
            isRecording
              ? "border border-rose-400/35 bg-rose-500/18 text-rose-100 shadow-[0_0_22px_rgba(244,63,94,0.12)] hover:bg-rose-500/28"
              : "border border-cyan-300/12 bg-slate-950/52 text-slate-100 shadow-[0_12px_28px_rgba(2,6,23,0.24)] hover:border-cyan-300/35 hover:bg-slate-950/70 hover:shadow-[0_0_22px_rgba(34,211,238,0.12)]"
          } disabled:cursor-not-allowed disabled:opacity-55`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRecording ? "bg-rose-300 shadow-[0_0_14px_rgba(253,164,175,0.8)]" : "bg-cyan-300"
            }`}
          />
          {isSupported ? (isRecording ? "Stop recording" : "Start recording") : "Voice unavailable"}
        </motion.button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="interview-control rounded-[14px] px-4 py-4 transition-all duration-300">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isSpeechActive ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" : "bg-slate-500"
                }`}
              />
              <span>{isSpeechActive ? "Speech detected" : "Waiting for speech"}</span>
            </div>
            <span className="interview-pill rounded-full px-3 py-1 text-xs font-bold text-cyan-100">
              Pauses {pauseCount}
            </span>
          </div>

          <WaveformBars bars={bars} />
        </div>

        <div className="interview-control rounded-[20px] px-4 py-4 transition-all duration-300">
          <ConfidenceMeter value={liveConfidence} />
          <p className="mt-4 text-sm leading-6 text-slate-400">
            HireSense AI estimates confidence from speech consistency, pauses, and activity while
            you respond.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorderPanel;
