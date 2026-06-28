const Groq = require("groq-sdk");

const { env } = require("../config/env");
const AppError = require("../utils/AppError");
const {
  buildSystemPrompt,
  buildResumeAnalysisPrompt,
  buildStartInterviewPrompt,
  buildAnswerEvaluationPrompt,
  buildFinalReportPrompt
} = require("../prompts/interviewPrompts");
const {
  buildQuestionHistory,
  decideNextDifficulty,
  ensureUniqueNextQuestion,
  normalizeConfidenceLevel,
  normalizeFollowUpIntent,
  normalizeTopicDepth
} = require("./contextualInterviewService");

const groq = new Groq({
  apiKey: env.groqApiKey
});

const model = "llama-3.3-70b-versatile";

const openingQuestionSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    difficulty: { type: "string" }
  },
  required: ["question", "difficulty"],
  additionalProperties: false
};

const resumeAnalysisSchema = {
  type: "object",
  properties: {
    primaryDomain: { type: "string" },
    experienceLevel: { type: "string" },
    interviewFocus: { type: "string" },
    skills: {
      type: "array",
      items: { type: "string" }
    },
    technologies: {
      type: "array",
      items: { type: "string" }
    },
    domains: {
      type: "array",
      items: { type: "string" }
    },
    frameworks: {
      type: "array",
      items: { type: "string" }
    },
    tools: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: [
    "primaryDomain",
    "experienceLevel",
    "interviewFocus",
    "skills",
    "technologies",
    "domains",
    "frameworks",
    "tools"
  ],
  additionalProperties: false
};

const answerEvaluationSchema = {
  type: "object",
  properties: {
    score: { type: "number" },
    feedback: { type: "string" },
    nextDifficulty: { type: "string" },
    nextQuestion: { type: "string" },
    confidenceLevel: { type: "string" },
    topicDepth: { type: "string" },
    topicFocus: { type: "string" },
    followUpIntent: { type: "string" }
  },
  required: [
    "score",
    "feedback",
    "nextDifficulty",
    "nextQuestion",
    "confidenceLevel",
    "topicDepth",
    "topicFocus",
    "followUpIntent"
  ],
  additionalProperties: false
};

const finalReportSchema = {
  type: "object",
  properties: {
    finalReport: { type: "string" },
    overallScore: { type: "number" },
    questionReviews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          userAnswer: { type: "string" },
          isCorrect: { type: "boolean" },
          whatWasGood: { type: "string" },
          missingConcepts: {
            type: "array",
            items: { type: "string" }
          },
          idealAnswer: { type: "string" }
        },
        required: [
          "question",
          "userAnswer",
          "isCorrect",
          "whatWasGood",
          "missingConcepts",
          "idealAnswer"
        ],
        additionalProperties: false
      }
    }
  },
  required: ["finalReport", "overallScore", "questionReviews"],
  additionalProperties: false
};

const safeParseJson = (rawText = "") => {
  const trimmedText = rawText.trim();

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    const firstBrace = trimmedText.indexOf("{");
    const lastBrace = trimmedText.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmedText.slice(firstBrace, lastBrace + 1));
    }

    throw error;
  }
};

const validateRequiredKeys = (payload, requiredKeys) => {
  const missingKeys = requiredKeys.filter((key) => payload[key] === undefined || payload[key] === null);

  if (missingKeys.length) {
    throw new SyntaxError(`Missing required keys in AI response: ${missingKeys.join(", ")}`);
  }

  return payload;
};

const extractStatusCode = (error) => {
  const directStatus = error?.status || error?.code || error?.response?.status;

  if (typeof directStatus === "number") {
    return directStatus;
  }

  const message = error?.message || "";
  const statusMatch = message.match(/\b(\d{3})\b/);

  if (statusMatch) {
    return Number(statusMatch[1]);
  }

  return undefined;
};

const normalizeScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(10, Math.max(0, Number(score.toFixed(1))));
};

const normalizeStringArray = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const dedupeStrings = (items) => [...new Set(normalizeStringArray(items))];

const summarizeScoreBand = (score) => {
  if (score >= 8) {
    return "advanced-level problem solving and communication";
  }

  if (score >= 6) {
    return "solid core understanding with room to deepen depth";
  }

  return "foundational understanding that still needs reinforcement";
};

const normalizeResumeProfile = (payload = {}) => ({
  primaryDomain: normalizeQuestionText(payload.primaryDomain, "General Technical Interview"),
  experienceLevel: normalizeQuestionText(payload.experienceLevel, "Intermediate"),
  interviewFocus: normalizeQuestionText(
    payload.interviewFocus,
    "General full-stack engineering fundamentals"
  ),
  skills: normalizeStringArray(payload.skills),
  technologies: normalizeStringArray(payload.technologies),
  domains: normalizeStringArray(payload.domains),
  frameworks: normalizeStringArray(payload.frameworks),
  tools: normalizeStringArray(payload.tools)
});

const normalizeDifficulty = (difficulty, fallback = "Intermediate") => {
  const allowed = ["Beginner", "Intermediate", "Advanced"];

  if (typeof difficulty !== "string") {
    return fallback;
  }

  const matched = allowed.find((item) => item.toLowerCase() === difficulty.trim().toLowerCase());
  return matched || fallback;
};

const normalizeQuestionText = (question, fallback = "Can you expand on your reasoning with a concrete example?") => {
  if (typeof question !== "string" || !question.trim()) {
    return fallback;
  }

  return question.trim();
};

const normalizeFeedbackText = (feedback, fallback = "Your answer was received, but the AI feedback response was incomplete.") => {
  if (typeof feedback !== "string" || !feedback.trim()) {
    return fallback;
  }

  return feedback.trim();
};

const normalizeTopicFocus = (value, fallback = "Core engineering fundamentals") => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
};

const normalizeFinalReportPayload = (payload = {}, context = {}) => {
  validateRequiredKeys(payload, ["finalReport", "overallScore", "questionReviews"]);
  const fallbackReviews = (context.answeredHistory || []).map((item) => ({
    question: item.question,
    userAnswer: item.answer,
    isCorrect: Number(item.score) >= 6,
    whatWasGood:
      Number(item.score) >= 6
        ? "Your answer covered part of the core idea and showed workable understanding."
        : "You attempted the concept and provided at least some relevant direction.",
    missingConcepts:
      Number(item.score) >= 8
        ? []
        : ["Deeper explanation of tradeoffs, implementation details, and interview-ready structure."],
    idealAnswer: "A complete interview-quality answer should define the concept clearly, explain how it works, mention important tradeoffs, and connect it to a practical real-world example."
  }));
  const questionReviews = Array.isArray(payload.questionReviews) && payload.questionReviews.length
    ? payload.questionReviews.map((review, index) => ({
        question: normalizeQuestionText(review.question, context.answeredHistory?.[index]?.question || "Interview question"),
        userAnswer: normalizeQuestionText(review.userAnswer, context.answeredHistory?.[index]?.answer || "No answer recorded."),
        isCorrect: Boolean(review.isCorrect),
        whatWasGood: normalizeFeedbackText(review.whatWasGood, "Your answer addressed part of the question."),
        missingConcepts: dedupeStrings(review.missingConcepts),
        idealAnswer: normalizeFeedbackText(
          review.idealAnswer,
          "A stronger answer would define the concept clearly, explain the reasoning, and include a practical example."
        )
      }))
    : fallbackReviews;

  return {
    finalReport: normalizeFeedbackText(
      payload.finalReport,
      "The interview was completed successfully. Review the question-by-question feedback below."
    ),
    overallScore: normalizeScore(payload.overallScore),
    questionReviews
  };
};

const supportsStructuredOutputs = (targetModel) =>
  ["openai/gpt-oss-20b", "openai/gpt-oss-120b"].includes(targetModel);

const callGroqStructuredJson = async ({ schemaName, schema, userPrompt }) => {
  try {
    const useStructuredOutputs = supportsStructuredOutputs(model);

    const response = await groq.chat.completions.create({
      model,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `${buildSystemPrompt()}\nReturn valid JSON only. Do not add markdown.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: useStructuredOutputs
        ? {
            type: "json_schema",
            json_schema: {
              name: schemaName,
              strict: true,
              schema
            }
          }
        : {
            type: "json_object"
          }
    });

    return safeParseJson(response.choices?.[0]?.message?.content || "");
  } catch (error) {
    const statusCode = extractStatusCode(error);
    const message = error?.message || "";

    // If the configured model rejects json_schema mode, retry once with JSON Object Mode.
    if (
      statusCode === 400 &&
      message.includes("does not support response format `json_schema`")
    ) {
      const fallbackResponse = await groq.chat.completions.create({
        model,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `${buildSystemPrompt()}\nReturn valid JSON only. Do not add markdown.`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: {
          type: "json_object"
        }
      });

      return safeParseJson(fallbackResponse.choices?.[0]?.message?.content || "");
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("Groq interview request failed:", {
        statusCode,
        message: error?.message,
        error
      });
    }

    if (statusCode === 429) {
      throw new AppError(
        "HireSense AI interview generation is temporarily rate-limited. Please try again shortly.",
        429
      );
    }

    if (statusCode === 401 || statusCode === 403) {
      throw new AppError(
        "HireSense AI could not authenticate with Groq. Please verify the GROQ_API_KEY configuration.",
        500
      );
    }

    if (error instanceof SyntaxError) {
      throw new AppError(
        "HireSense AI received an invalid AI response. Please try again.",
        500
      );
    }

    throw new AppError(
      "HireSense AI could not complete the interview AI request right now. Please try again shortly.",
      500
    );
  }
};

const generateOpeningQuestion = async (configuration) => {
  const payload = await callGroqStructuredJson({
    schemaName: "opening_interview_question",
    schema: openingQuestionSchema,
    userPrompt: buildStartInterviewPrompt(configuration)
  });

  return {
    question: normalizeQuestionText(payload?.question),
    difficulty: normalizeDifficulty(payload?.difficulty, configuration.difficulty)
  };
};

const analyzeResumeProfile = async (resumeText) => {
  const payload = await callGroqStructuredJson({
    schemaName: "resume_interview_profile",
    schema: resumeAnalysisSchema,
    userPrompt: buildResumeAnalysisPrompt(resumeText)
  });

  return normalizeResumeProfile(payload);
};

const evaluateInterviewAnswer = async ({
  configuration,
  currentQuestion,
  answer,
  currentDifficulty,
  answeredHistory,
  qaHistory,
  questionNumber,
  totalQuestions
}) => {
  const questionHistory = buildQuestionHistory(qaHistory || answeredHistory);
  const payload = await callGroqStructuredJson({
    schemaName: "adaptive_interview_answer_evaluation",
    schema: answerEvaluationSchema,
    userPrompt: buildAnswerEvaluationPrompt({
      domain: configuration.domain,
      interviewType: configuration.interviewType,
      currentDifficulty,
      currentQuestion,
      answer,
      answeredHistory,
      questionHistory,
      resumeProfile: configuration.resumeProfile,
      questionNumber,
      totalQuestions
    })
  });
  const normalizedScore = normalizeScore(payload?.score);
  const confidenceLevel = normalizeConfidenceLevel(payload?.confidenceLevel);
  const topicDepth = normalizeTopicDepth(payload?.topicDepth);
  const followUpIntent = normalizeFollowUpIntent(payload?.followUpIntent, normalizedScore);
  const computedDifficulty = decideNextDifficulty({
    currentDifficulty,
    score: normalizedScore,
    confidenceLevel,
    topicDepth,
    followUpIntent
  });
  const fallbackQuestion =
    followUpIntent === "recover"
      ? "Walk me through the core fundamentals behind your previous answer with one concrete example."
      : "Take that one step further and explain the tradeoff or design decision you would make in a real system.";
  const nextQuestion = ensureUniqueNextQuestion(
    normalizeQuestionText(payload?.nextQuestion, fallbackQuestion),
    questionHistory,
    fallbackQuestion
  );

  return {
    score: normalizedScore,
    feedback: normalizeFeedbackText(payload?.feedback),
    nextDifficulty: normalizeDifficulty(payload?.nextDifficulty, computedDifficulty),
    nextQuestion,
    confidenceLevel,
    topicDepth,
    topicFocus: normalizeTopicFocus(payload?.topicFocus),
    followUpIntent
  };
};

const generateFinalInterviewReport = async ({ configuration, resumeProfile, answeredHistory, overallScore }) => {
  const payload = await callGroqStructuredJson({
    schemaName: "interview_final_report",
    schema: finalReportSchema,
    userPrompt: buildFinalReportPrompt({
      configuration,
      resumeProfile,
      answeredHistory,
      overallScore
    })
  });

  return normalizeFinalReportPayload(payload, {
    resumeProfile,
    answeredHistory,
    overallScore
  });
};

module.exports = {
  analyzeResumeProfile,
  generateOpeningQuestion,
  evaluateInterviewAnswer,
  generateFinalInterviewReport
};
