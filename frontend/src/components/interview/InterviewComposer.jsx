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
    <div className="interview-glass-card space-y-6 rounded-[18px] p-6 transition-all duration-300 sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Response
          </p>
          <h3 className="mt-2 text-xl font-extrabold leading-tight text-slate-50">Answer thoughtfully, then continue</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-300">Auto-submit on timeout</div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSubmitEnabled}
              onChange={(event) => onToggleAutoSubmit(event.target.checked)}
              className="sr-only peer"
            />
            <div className="toggle-track h-7 w-12 rounded-full bg-slate-800/60 border border-white/6 peer-checked:bg-cyan-500/30 peer-focus:ring"></div>
            <div className="toggle-knob absolute left-0 top-0 m-1 h-5 w-5 rounded-full bg-slate-200 shadow-sm transition-transform peer-checked:translate-x-5 peer-checked:bg-cyan-200"></div>
          </label>
        </div>
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
        className="clay-input min-h-[180px] w-full resize-none rounded-[16px] px-5 py-5 text-sm leading-7 text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-400"
      />

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.18 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex h-14 items-center justify-center gap-3 rounded-[18px] px-6 text-sm font-semibold text-slate-950 clay-btn primary-cta transition duration-300 disabled:cursor-not-allowed disabled:opacity-70"
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
          className="h-12 rounded-[14px] clay-btn-secondary px-4 text-sm font-semibold text-slate-200 transition duration-300"
        >
          End interview
        </button>
      </div>
    </div>
  );
};

export default InterviewComposer;
