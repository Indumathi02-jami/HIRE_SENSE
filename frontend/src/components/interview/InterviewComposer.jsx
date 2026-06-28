import { motion } from "framer-motion";

import useSpeechInterview from "../../hooks/useSpeechInterview";
import InterviewTimer from "./InterviewTimer";
import VoiceRecorderPanel from "./VoiceRecorderPanel";

const InterviewComposer = ({
  answer,
  onAnswerChange,
  onSubmit,
  onEndInterview,
  isSubmitting,
  timerKey,
  autoSubmitEnabled,
  onToggleAutoSubmit,
  onTimerExpire,
  onVoiceError
}) => {
  const {
    isSupported,
    isRecording,
    isSpeechActive,
    bars,
    pauseCount,
    liveConfidence,
    communicationInput,
    startRecording,
    stopRecording,
    reset
  } = useSpeechInterview({
    onTranscriptChange: onAnswerChange,
    onError: onVoiceError
  });

  const handleStartRecording = () => {
    startRecording(answer);
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSubmit = () => {
    if (isRecording) {
      stopRecording();
    }

    onSubmit(communicationInput);
    window.setTimeout(() => {
      reset();
    }, 0);
  };

  return (
    <div className="glass-card space-y-5 rounded-[32px] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.4)] border border-cyan-500/10 sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Response
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">Answer thoughtfully, then continue</h3>
        </div>

        <label className="inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-slate-950/40 px-4 py-2 text-xs font-semibold text-slate-200">
          <input
            type="checkbox"
            checked={autoSubmitEnabled}
            onChange={(event) => onToggleAutoSubmit(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5"
          />
          Auto-submit on timeout
        </label>
      </div>

      <InterviewTimer
        timerKey={timerKey}
        isRunning={!isSubmitting}
        autoSubmitEnabled={autoSubmitEnabled}
        onExpire={onTimerExpire}
      />

      <VoiceRecorderPanel
        isSupported={isSupported}
        isRecording={isRecording}
        isSpeechActive={isSpeechActive}
        bars={bars}
        pauseCount={pauseCount}
        liveConfidence={liveConfidence}
        onStart={handleStartRecording}
        onStop={handleStopRecording}
      />

      <textarea
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        placeholder="Type your answer here. Focus on clarity, structure, and technical depth."
        className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/60 hover:border-cyan-300/25 focus:border-cyan-400/40 focus:shadow-[0_0_15px_rgba(34,211,238,0.12)] px-4 py-4 text-sm leading-7 text-white outline-none transition-all duration-300 placeholder:text-slate-500"
      />

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.18 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-6 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.25)] hover:shadow-glow-cyan transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
              <span>Evaluating answer...</span>
            </>
          ) : (
            "Submit answer"
          )}
        </motion.button>

        <button
          type="button"
          onClick={onEndInterview}
          className="h-14 rounded-2xl border border-cyan-500/10 bg-slate-950/40 px-5 text-sm font-semibold text-slate-200 transition hover:bg-slate-950/70 hover:border-cyan-400/30 hover:text-white"
        >
          End interview
        </button>
      </div>
    </div>
  );
};

export default InterviewComposer;
