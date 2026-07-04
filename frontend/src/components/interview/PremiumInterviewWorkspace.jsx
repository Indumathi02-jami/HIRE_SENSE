import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthToast from "../auth/AuthToast";
import useToast from "../../hooks/useToast";
import useSpeechInterview from "../../hooks/useSpeechInterview";
import {
  analyzeInterviewResume,
  endInterview,
  startInterview,
  submitInterviewAnswer
} from "../../services/interviewApi";
import { useInterviewStore } from "../../store/interviewStore";

import InterviewConfigurator from "./InterviewConfigurator";
import InterviewReport from "./InterviewReport";
import InterviewHeader from "./InterviewHeader";
import AIInterviewerPanel from "./AIInterviewerPanel";
import ResponseComposer from "./ResponseComposer";
import CircularTimer from "./CircularTimer";
import BottomActionBar from "./BottomActionBar";

const PremiumInterviewWorkspace = () => {
  const navigate = useNavigate();
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

  const {
    isSupported,
    isRecording,
    isSpeechActive,
    bars,
    liveConfidence,
    communicationInput,
    startRecording,
    stopRecording,
    reset: resetRecorder
  } = useSpeechInterview({
    onTranscriptChange: setCurrentAnswer,
    onError: (msg) => pushToast(msg, "error")
  });

  // Handlers
  const handleAnalyzeResume = async (file) => {
    if (!file) return;
    try {
      setIsAnalyzingResume(true);
      setAnalysisUploadProgress(0);
      const response = await analyzeInterviewResume(file, (progressEvent) => {
        const totalBytes = progressEvent.total || file.size || 1;
        const progressValue = Math.round((progressEvent.loaded * 100) / totalBytes);
        setAnalysisUploadProgress(progressValue);
      });
      setResumeAnalysis(response.data);
      pushToast("Resume analyzed successfully!", "success");
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
      pushToast("Interview started. Good luck!", "success");
    } catch (error) {
      pushToast(error.message || "Unable to start the interview.", "error");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (forcedAnswer, communicationInput) => {
    const answerToSend = (forcedAnswer ?? currentAnswer).trim();
    if (!answerToSend) {
      pushToast("Please enter an answer.", "error");
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
      pushToast("Answer evaluated!", "success");
    } catch (error) {
      pushToast(error.message || "Unable to submit answer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    if (!session?.sessionId) return;
    try {
      setIsEnding(true);
      const response = await endInterview({ sessionId: session.sessionId });
      completeSession(response.data.session);
      navigate(`/reports/${response.data.session.sessionId}`);
      pushToast("Interview complete!", "success");
    } catch (error) {
      pushToast(error.message || "Unable to complete the interview.", "error");
    } finally {
      setIsEnding(false);
    }
  };

  const handleTimerExpire = () => {
    if (!autoSubmitOnTimeout || isSubmitting) return;
    const fallbackAnswer = currentAnswer.trim() || "No answer submitted.";
    handleSubmitAnswer(fallbackAnswer);
  };

  const handleSkipQuestion = () => {
    // Save empty answer and move to next
    handleSubmitAnswer("");
  };

  // Render Configuration Phase
  if (phase === "configuration") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <AuthToast toasts={toasts} onDismiss={dismissToast} />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
        </div>
      </div>
    );
  }

  // Render Report Phase
  if (phase === "report" && session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <AuthToast toasts={toasts} onDismiss={dismissToast} />
        <InterviewReport session={session} onReset={resetInterview} />
      </div>
    );
  }

  // Render Interview/Review Phase
  if ((phase === "interview" || phase === "review") && session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <AuthToast toasts={toasts} onDismiss={dismissToast} />

        {/* Header */}
        <InterviewHeader
          sessionId={session.sessionId}
          currentQuestionNumber={session.currentQuestionNumber}
          totalQuestions={session.totalQuestions}
          difficulty={configuration.difficulty}
          candidateName={resumeAnalysis?.resumeProfile?.name}
          onEndInterview={handleEndInterview}
          isEnding={isEnding}
        />

        {/* Main Content - Offset for header and action bar */}
        <main className="mt-20 mb-28 px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl">
            {phase === "interview" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - AI Interviewer (1 col) */}
                <div className="lg:col-span-1">
                  <AIInterviewerPanel
                    currentQuestion={currentQuestion}
                    currentQuestionNumber={session.currentQuestionNumber}
                    totalQuestions={session.totalQuestions}
                    qaHistory={session.qaHistory}
                    difficulty={configuration.difficulty}
                  />
                </div>

                {/* Right Column - Response & Controls (2 cols) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Response Composer */}
                  <div>
                    <ResponseComposer
                      answer={currentAnswer}
                      onAnswerChange={setCurrentAnswer}
                      isRecording={isRecording}
                      isSpeechActive={isSpeechActive}
                      liveConfidence={liveConfidence}
                      onStartRecording={() => startRecording(currentAnswer)}
                      onStopRecording={stopRecording}
                      isSupported={isSupported}
                    />
                  </div>

                  {/* Timer */}
                  <div>
                    <CircularTimer
                      timerKey={timerKey}
                      isRunning={!isSubmitting}
                      autoSubmitEnabled={autoSubmitOnTimeout}
                      onExpire={handleTimerExpire}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Review Phase */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-slate-100 mb-4">
                  All Questions Complete!
                </h2>
                <p className="text-slate-400 mb-6">
                  Generate your personalized AI performance report to review strengths, areas for improvement, and recommendations.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndInterview}
                  disabled={isEnding}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 disabled:opacity-50"
                >
                  {isEnding ? "Generating..." : "Generate Report"}
                </motion.button>
              </motion.div>
            )}
          </div>
        </main>

        {/* Bottom Action Bar */}
        {phase === "interview" && (
          <BottomActionBar
            onSubmit={() => {
              if (isRecording) stopRecording();
              handleSubmitAnswer(undefined, communicationInput);
              setTimeout(() => resetRecorder(), 0);
            }}
            onEndInterview={handleEndInterview}
            onSkipQuestion={handleSkipQuestion}
            isSubmitting={isSubmitting}
            autoSubmitEnabled={autoSubmitOnTimeout}
            onToggleAutoSubmit={setAutoSubmitOnTimeout}
            answerLength={currentAnswer.trim().length}
          />
        )}
      </div>
    );
  }

  return null;
};

export default PremiumInterviewWorkspace;
