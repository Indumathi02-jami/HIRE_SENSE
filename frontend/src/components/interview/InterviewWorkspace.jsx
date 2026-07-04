import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthToast from "../auth/AuthToast";
import useToast from "../../hooks/useToast";
import {
  analyzeInterviewResume,
  endInterview,
  startInterview,
  submitInterviewAnswer
} from "../../services/interviewApi";
import { useInterviewStore } from "../../store/interviewStore";
import InterviewChat from "./InterviewChat";
import InterviewComposer from "./InterviewComposer";
import InterviewConfigurator from "./InterviewConfigurator";
import InterviewReport from "./InterviewReport";

const phaseVariants = {
  initial: {
    opacity: 0,
    y: 22,
    scale: 0.985,
    filter: "blur(8px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.992,
    filter: "blur(6px)",
    transition: {
      duration: 0.22,
      ease: "easeInOut"
    }
  }
};

const sidePanelVariants = {
  initial: {
    opacity: 0,
    x: 20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08,
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: {
      duration: 0.18,
      ease: "easeInOut"
    }
  }
};

const InterviewWorkspace = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const {
    phase,
    configuration,
    resumeAnalysis,
    session,
    currentAnswer,
    autoSubmitOnTimeout,
    setConfiguration,
    setResumeAnalysis,
    setCurrentAnswer,
    setAutoSubmitOnTimeout,
    startSession,
    applyAnswerResult,
    completeSession,
    resetInterview
  } = useInterviewStore();

  const { toasts, pushToast, dismissToast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [analysisUploadProgress, setAnalysisUploadProgress] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());

  const currentQuestion = session?.currentQuestion || null;
  const timerKey = useMemo(
    () => `${session?.sessionId || "new"}-${session?.currentQuestionNumber || 0}`,
    [session?.currentQuestionNumber, session?.sessionId]
  );
  const phaseMotion = useMemo(
    () =>
      prefersReducedMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.16 } },
            exit: { opacity: 0, transition: { duration: 0.12 } }
          }
        : phaseVariants,
    [prefersReducedMotion]
  );
  const sideMotion = useMemo(
    () =>
      prefersReducedMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.16 } },
            exit: { opacity: 0, transition: { duration: 0.12 } }
          }
        : sidePanelVariants,
    [prefersReducedMotion]
  );

  const handleAnalyzeResume = async (file) => {
    if (!file) {
      return;
    }

    try {
      setIsAnalyzingResume(true);
      setAnalysisUploadProgress(0);
      const response = await analyzeInterviewResume(file, (progressEvent) => {
        const totalBytes = progressEvent.total || file.size || 1;
        const progressValue = Math.round((progressEvent.loaded * 100) / totalBytes);
        setAnalysisUploadProgress(progressValue);
      });

      setResumeAnalysis(response.data);
      pushToast("Resume analyzed. Interview stack detected successfully.", "success");
    } catch (error) {
      pushToast(error.message || "Unable to analyze the resume.", "error");
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setIsStarting(true);
      const response = await startInterview({
        difficulty: configuration.difficulty,
        interviewType: configuration.interviewType,
        analysisToken: resumeAnalysis?.analysisToken
      });
      startSession({
        configuration,
        resumeAnalysis,
        session: response.data.session
      });
      setQuestionStartedAt(Date.now());
      pushToast("Interview session started. Good luck.", "success");
    } catch (error) {
      pushToast(error.message || "Unable to start the interview.", "error");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (forcedAnswer, communicationInput) => {
    const answerToSend = (forcedAnswer ?? currentAnswer).trim();

    if (!answerToSend) {
      pushToast("Please enter an answer before submitting.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
      const response = await submitInterviewAnswer({
        sessionId: session.sessionId,
        answer: answerToSend,
        timeTaken: elapsedSeconds,
        communicationInput
      });

      applyAnswerResult({
        session: response.data.session,
        isInterviewComplete: response.data.isInterviewComplete
      });
      setQuestionStartedAt(Date.now());

      pushToast("Answer evaluated successfully.", "success");
    } catch (error) {
      pushToast(error.message || "Unable to submit your answer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    if (!session?.sessionId) {
      return;
    }

    try {
      setIsEnding(true);
      const response = await endInterview({
        sessionId: session.sessionId
      });
      completeSession(response.data.session);
      navigate(`/reports/${response.data.session.sessionId}`);
      pushToast("Interview report generated successfully.", "success");
    } catch (error) {
      pushToast(error.message || "Unable to complete the interview.", "error");
    } finally {
      setIsEnding(false);
    }
  };

  const handleTimerExpire = () => {
    if (!autoSubmitOnTimeout || isSubmitting) {
      return;
    }

    const fallbackAnswer = currentAnswer.trim() || "No answer submitted before the timer expired.";
    handleSubmitAnswer(fallbackAnswer);
  };

  return (
    <>
      <AuthToast toasts={toasts} onDismiss={dismissToast} />

      <AnimatePresence mode="wait" initial={false}>
        {phase === "configuration" ? (
          <motion.div
            key="configuration"
            variants={phaseMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.06, duration: prefersReducedMotion ? 0.16 : 0.28 }}
            >
              <InterviewConfigurator
                configuration={configuration}
                resumeAnalysis={resumeAnalysis}
                isAnalyzing={isAnalyzingResume}
                isStarting={isStarting}
                uploadProgress={analysisUploadProgress}
                onChange={setConfiguration}
                onResumeSelect={handleAnalyzeResume}
                onStart={handleStartInterview}
              />
            </motion.div>
          </motion.div>
        ) : null}

        {(phase === "interview" || phase === "review") && session ? (
          <motion.div
            key={phase}
            variants={phaseMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="interview-ui grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.16 }
                  : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <InterviewChat
                qaHistory={session.qaHistory}
                currentQuestion={currentQuestion}
                currentQuestionNumber={session.currentQuestionNumber}
                totalQuestions={session.totalQuestions}
              />
            </motion.div>

            {phase === "interview" ? (
              <motion.div
                variants={sideMotion}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <InterviewComposer
                  answer={currentAnswer}
                  onAnswerChange={setCurrentAnswer}
                  onSubmit={(communicationInput) => handleSubmitAnswer(undefined, communicationInput)}
                  onEndInterview={handleEndInterview}
                  isSubmitting={isSubmitting || isEnding}
                  timerKey={timerKey}
                  autoSubmitEnabled={autoSubmitOnTimeout}
                  onToggleAutoSubmit={setAutoSubmitOnTimeout}
                  onTimerExpire={handleTimerExpire}
                  onVoiceError={(message) => pushToast(message, "error")}
                />
              </motion.div>
            ) : (
              <motion.div
                variants={sideMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="interview-glass-card space-y-4 rounded-[20px] p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                  Interview Complete
                </p>
                <h3 className="text-2xl font-bold text-white">All questions answered</h3>
                <p className="text-sm leading-7 text-slate-300">
                  Generate your final AI performance report to review strengths, weak areas, and recommended next topics.
                </p>
                <motion.button
                  type="button"
                  onClick={handleEndInterview}
                  disabled={isEnding}
                  whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.01 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-6 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.25)] hover:shadow-glow-cyan transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isEnding ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
                      <span>Generating final report...</span>
                    </>
                  ) : (
                    "Generate final report"
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : null}

        {phase === "report" && session ? (
          <motion.div
            key="report"
            variants={phaseMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <InterviewReport
              session={session}
              onReset={resetInterview}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default InterviewWorkspace;
