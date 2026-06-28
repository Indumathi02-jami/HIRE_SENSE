import { motion } from "framer-motion";

const WaveformBars = ({ bars = [] }) => (
  <div className="flex h-16 items-end gap-1.5">
    {bars.map((bar, index) => (
      <motion.span
        key={`bar-${index}`}
        animate={{ height: `${bar}px` }}
        transition={{ duration: 0.18 }}
        className="w-2 rounded-full bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-200"
      />
    ))}
  </div>
);

const ConfidenceMeter = ({ value = 0 }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
      <span>Confidence Meter</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-900/70">
      <motion.div
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.22 }}
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500"
      />
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
    <div className="space-y-4 rounded-[28px] border border-cyan-500/10 bg-slate-950/40 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Voice Response
          </p>
          <h4 className="mt-2 text-lg font-semibold text-white">Speak your answer naturally</h4>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.18 }}
          onClick={isRecording ? onStop : onStart}
          disabled={!isSupported}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] ${
            isRecording
              ? "bg-rose-500/20 text-rose-100 border border-rose-500/30 hover:bg-rose-500/30 shadow-glow-rose"
              : "bg-slate-950/40 text-slate-200 border border-cyan-500/10 hover:border-cyan-400/35 hover:bg-slate-950/60"
          } disabled:cursor-not-allowed disabled:opacity-55`}
        >
          {isSupported ? (isRecording ? "Stop recording" : "Start recording") : "Voice unavailable"}
        </motion.button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-white/5 bg-slate-950/20 px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-slate-200">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isSpeechActive ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" : "bg-slate-500"
                }`}
              />
              <span>{isSpeechActive ? "Speech detected" : "Waiting for speech"}</span>
            </div>
            <span className="rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1 text-xs font-semibold text-cyan-200">
              Pauses {pauseCount}
            </span>
          </div>

          <WaveformBars bars={bars} />
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-950/20 px-4 py-4">
          <ConfidenceMeter value={liveConfidence} />
          <p className="mt-3 text-sm leading-6 text-slate-400">
            HireSense AI estimates confidence from speech consistency, pauses, and activity while
            you respond.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorderPanel;
