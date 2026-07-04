const InterviewSession = require("../models/InterviewSession");
const groqService = require("./groqService");
const {
  analyzeSpeechCommunication,
  generateCommunicationAnalytics,
  buildInsufficientSpeechAnalysis
} = require("./speechAnalysisService");
const AppError = require("../utils/AppError");
const { verifyResumeAnalysisToken } = require("../utils/resumeAnalysisToken");
const { validateResponse } = require("../utils/responseValidation");

const TOTAL_QUESTIONS = 5;
const allowedDifficulties = ["Beginner", "Intermediate", "Advanced"];
const allowedInterviewTypes = ["Technical", "Behavioral", "System Design", "Mixed"];

const validateConfiguration = ({ difficulty, interviewType, analysisToken }) => {
  if (!allowedDifficulties.includes(difficulty)) {
    throw new AppError("Please choose a valid difficulty level.", 400);
  }

  if (!allowedInterviewTypes.includes(interviewType)) {
    throw new AppError("Please choose a valid interview type.", 400);
  }

  if (!analysisToken) {
    throw new AppError("Please analyze a resume before starting the interview.", 400);
  }
};

const buildAnsweredHistory = (qaHistory) =>
  qaHistory
    .filter((item) => item.answer?.trim())
    .map((item) => ({
      question: item.question,
      answer: item.answer,
      aiFeedback: item.aiFeedback,
      score: item.score,
      difficulty: item.difficulty,
      topicFocus: item.topicFocus,
      topicDepth: item.topicDepth,
      confidenceLevel: item.confidenceLevel,
      followUpIntent: item.followUpIntent,
      communicationAnalysis: item.communicationAnalysis,
      timeTaken: item.timeTaken
    }));

const findPendingQuestion = (qaHistory) => qaHistory.find((item) => !item.answer?.trim()) || null;

const formatSession = (sessionDocument) => {
  const session = sessionDocument.toObject ? sessionDocument.toObject() : sessionDocument;
  const answeredQuestions = buildAnsweredHistory(session.qaHistory);
  const pendingQuestion = findPendingQuestion(session.qaHistory);
  const currentQuestionNumber = pendingQuestion ? answeredQuestions.length + 1 : answeredQuestions.length;

  return {
    sessionId: session.sessionId,
    configuration: session.configuration,
    resumeProfile: session.resumeProfile,
    status: session.status,
    totalQuestions: TOTAL_QUESTIONS,
    answeredQuestions: answeredQuestions.length,
    currentQuestionNumber,
    currentQuestion: pendingQuestion?.question || null,
    currentDifficulty: pendingQuestion?.difficulty || null,
    qaHistory: session.qaHistory,
    finalReport: session.finalReport,
    overallScore: session.overallScore,
    communicationReport: session.communicationReport,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt
  };
};

const calculateOverallScore = (qaHistory) => {
  const scoredEntries = qaHistory.filter((item) => typeof item.score === "number");

  if (!scoredEntries.length) {
    return 0;
  }

  const totalScore = scoredEntries.reduce((sum, item) => sum + item.score, 0);
  return Number((totalScore / scoredEntries.length).toFixed(1));
};

const startInterview = async ({ userId, configuration }) => {
  validateConfiguration(configuration);
  const analyzedResume = verifyResumeAnalysisToken(configuration.analysisToken);

  const normalizedConfiguration = {
    domain: analyzedResume.resumeProfile.primaryDomain,
    difficulty: configuration.difficulty,
    interviewType: configuration.interviewType,
    resumeProfile: analyzedResume.resumeProfile
  };

  const openingQuestion = await groqService.generateOpeningQuestion(normalizedConfiguration);

  const session = await InterviewSession.create({
    userId,
    configuration: {
      domain: normalizedConfiguration.domain,
      difficulty: normalizedConfiguration.difficulty,
      interviewType: normalizedConfiguration.interviewType
    },
    resumeProfile: {
      ...normalizedConfiguration.resumeProfile,
      originalName: analyzedResume.originalName
    },
    qaHistory: [
      {
        question: openingQuestion.question,
        difficulty: openingQuestion.difficulty || normalizedConfiguration.difficulty,
        topicFocus: normalizedConfiguration.domain,
        topicDepth: "Working",
        confidenceLevel: "Medium",
        followUpIntent: "validate"
      }
    ],
    status: "in-progress"
  });

  return {
    session: formatSession(session),
    firstQuestion: openingQuestion.question
  };
};

const submitAnswer = async ({
  userId,
  sessionId,
  answer,
  timeTaken = 0,
  communicationInput = null
}) => {
  const cleanAnswer = answer?.trim();

  if (!cleanAnswer) {
    throw new AppError("Please enter an answer before submitting.", 400);
  }

  const session = await InterviewSession.findOne({
    sessionId,
    userId,
    status: "in-progress"
  });

  if (!session) {
    throw new AppError("Interview session not found or already completed.", 404);
  }

  const pendingIndex = session.qaHistory.findIndex((item) => !item.answer?.trim());

  if (pendingIndex === -1) {
    throw new AppError("There is no pending interview question in this session.", 400);
  }

  const pendingQuestion = session.qaHistory[pendingIndex];
  const answeredHistory = buildAnsweredHistory(session.qaHistory);
  const currentQuestionNumber = answeredHistory.length + 1;

  const responseValidation = validateResponse(cleanAnswer);

  const evaluation = responseValidation.isValid
    ? await groqService.evaluateInterviewAnswer({
        configuration: {
          ...session.configuration.toObject?.() || session.configuration,
          resumeProfile: session.resumeProfile.toObject?.() || session.resumeProfile
        },
        currentQuestion: pendingQuestion.question,
        answer: cleanAnswer,
        currentDifficulty: pendingQuestion.difficulty,
        answeredHistory,
        qaHistory: session.qaHistory,
        questionNumber: currentQuestionNumber,
        totalQuestions: TOTAL_QUESTIONS
      })
    : {
        score: 0,
        feedback:
          "This response was too short or unclear to evaluate. Please provide a more complete answer so the interviewer can assess your reasoning.",
        nextDifficulty: pendingQuestion.difficulty,
        nextQuestion:
          "Please expand your previous answer with additional detail, examples, and the reasoning behind your approach.",
        confidenceLevel: "Low",
        topicDepth: "Surface",
        topicFocus: pendingQuestion.topicFocus || session.configuration.domain,
        followUpIntent: "recover"
      };

  session.qaHistory[pendingIndex].answer = cleanAnswer;
  session.qaHistory[pendingIndex].aiFeedback = evaluation.feedback;
  session.qaHistory[pendingIndex].score = evaluation.score;
  session.qaHistory[pendingIndex].topicFocus = evaluation.topicFocus;
  session.qaHistory[pendingIndex].topicDepth = evaluation.topicDepth;
  session.qaHistory[pendingIndex].confidenceLevel = evaluation.confidenceLevel;
  session.qaHistory[pendingIndex].followUpIntent = evaluation.followUpIntent;
  session.qaHistory[pendingIndex].communicationAnalysis = responseValidation.isValid
    ? analyzeSpeechCommunication({
        transcript: communicationInput?.transcript || cleanAnswer,
        speechDurationSeconds: communicationInput?.speechDurationSeconds || timeTaken,
        pauseCount: communicationInput?.pauseCount || 0,
        speechActivityRatio: communicationInput?.speechActivityRatio || 0,
        averageVolume: communicationInput?.averageVolume || 0,
        transcriptSource: communicationInput?.transcriptSource || "manual"
      })
    : buildInsufficientSpeechAnalysis({
        transcriptSource: communicationInput?.transcriptSource || "manual",
        validationResult: responseValidation
      });
  session.qaHistory[pendingIndex].timeTaken = Number(timeTaken) || 0;

  const hasMoreQuestions = currentQuestionNumber < TOTAL_QUESTIONS;

  if (hasMoreQuestions) {
    session.qaHistory.push({
      question: evaluation.nextQuestion,
      difficulty: evaluation.nextDifficulty,
      topicFocus: evaluation.topicFocus,
      topicDepth: evaluation.topicDepth,
      confidenceLevel: evaluation.confidenceLevel,
      followUpIntent: evaluation.followUpIntent
    });
  }

  await session.save();

  return {
    session: formatSession(session),
    evaluation: {
      score: evaluation.score,
      feedback: evaluation.feedback,
      confidenceLevel: evaluation.confidenceLevel,
      topicDepth: evaluation.topicDepth,
      topicFocus: evaluation.topicFocus,
      followUpIntent: evaluation.followUpIntent,
      communicationAnalysis: session.qaHistory[pendingIndex].communicationAnalysis,
      nextDifficulty: hasMoreQuestions ? evaluation.nextDifficulty : null,
      nextQuestion: hasMoreQuestions ? evaluation.nextQuestion : null
    },
    isInterviewComplete: !hasMoreQuestions
  };
};

const endInterview = async ({ userId, sessionId }) => {
  const session = await InterviewSession.findOne({
    sessionId,
    userId
  });

  if (!session) {
    throw new AppError("Interview session not found.", 404);
  }

  const answeredHistory = buildAnsweredHistory(session.qaHistory);

  if (!answeredHistory.length) {
    throw new AppError("Complete at least one answer before ending the interview.", 400);
  }

  const overallScore = calculateOverallScore(session.qaHistory);
  const report = await groqService.generateFinalInterviewReport({
    configuration: session.configuration,
    resumeProfile: session.resumeProfile,
    answeredHistory,
    overallScore
  });

  session.finalReport = report.finalReport;
  session.overallScore = report.overallScore ?? overallScore;
  session.qaHistory = session.qaHistory.map((entry, index) => {
    const review = report.questionReviews?.[index];

    if (!review) {
      return entry;
    }

    entry.answerReview = {
      isCorrect: review.isCorrect,
      whatWasGood: review.whatWasGood,
      missingConcepts: review.missingConcepts,
      idealAnswer: review.idealAnswer
    };

    return entry;
  });
  session.communicationReport = generateCommunicationAnalytics(session.qaHistory);
  session.status = "completed";

  await session.save();

  return {
    session: formatSession(session)
  };
};

const getReportBySessionId = async ({ userId, reportId }) => {
  const session = await InterviewSession.findOne({
    sessionId: reportId,
    userId,
    status: "completed"
  });

  if (!session) {
    throw new AppError("Interview report not found.", 404);
  }

  return {
    session: formatSession(session)
  };
};

module.exports = {
  TOTAL_QUESTIONS,
  startInterview,
  submitAnswer,
  endInterview,
  getReportBySessionId
};
