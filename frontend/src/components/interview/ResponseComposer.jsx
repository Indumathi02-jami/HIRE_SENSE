import { motion } from "framer-motion";
import { MessageSquare, Mic, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

const ResponseComposer = ({
  answer,
  onAnswerChange,
  isRecording,
  isSpeechActive,
  liveConfidence,
  onStartRecording,
  onStopRecording,
  isSupported
}) => {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;
  const wordCount = answer.trim().split(/\s+/).filter((w) => w.length > 0).length;

  useEffect(() => {
    setCharCount(answer.length);
  }, [answer]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Response Card */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-cyan-300" />
            <h3 className="text-sm font-bold text-slate-100">Your Response</h3>
          </div>
          <p className="text-xs text-slate-400">Share your thoughts clearly and concisely. Focus on depth and structure.</p>
        </div>

        {/* Textarea */}
        <div className="p-6">
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here... Be detailed, thoughtful, and clear about your reasoning and approach."
            maxLength={maxChars}
            className="w-full h-48 resize-none rounded-xl border border-slate-600/40 bg-slate-900/50 text-slate-50 placeholder-slate-500 p-4 text-sm leading-relaxed focus:outline-none focus:border-cyan-400/60 focus:bg-slate-900/70 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          />

          {/* Stats Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>
              <span className="text-cyan-300 font-semibold">{wordCount}</span> words • 
              <span className="text-slate-500 ml-1">{charCount}/{maxChars}</span>
            </span>
            {charCount > maxChars * 0.9 && (
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-amber-400 font-semibold"
              >
                Approaching limit
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Voice Recording Card */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.8, repeat: isRecording ? Infinity : 0 }}
            >
              <Mic className={`w-5 h-5 ${ isRecording ? "text-rose-400" : "text-cyan-300"}`} />
            </motion.div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Voice Response</h4>
              <p className="text-xs text-slate-400 mt-0.5">{isRecording ? "Recording in progress..." : "Start speaking to record"}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={!isSupported}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isRecording
                ? "bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30"
                : "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSupported ? (isRecording ? "Stop" : "Start") : "Unavailable"}
          </motion.button>
        </div>

        {/* Waveform */}
        {isSupported && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 h-12 p-3 rounded-lg bg-slate-900/60 border border-slate-700/30">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isRecording ? Math.random() * 100 + 20 : 8
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 rounded-full bg-gradient-to-t from-cyan-400 to-cyan-200 shadow-lg shadow-cyan-500/30 origin-bottom"
                />
              ))}
            </div>

            {/* Confidence Badge */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
              >
                <Volume2 className="w-4 h-4 text-emerald-300" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-300">Confidence</p>
                  <div className="h-1.5 w-full rounded-full bg-emerald-900/30 overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${liveConfidence}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300">{liveConfidence}%</span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResponseComposer;
