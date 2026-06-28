const difficultyOrder = ["Beginner", "Intermediate", "Advanced"];
const confidenceLevels = ["Low", "Medium", "High"];
const topicDepthLevels = ["Surface", "Working", "Deep"];

const clampDifficultyIndex = (index) =>
  Math.max(0, Math.min(difficultyOrder.length - 1, index));

const normalizeDifficulty = (value, fallback = "Intermediate") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const matched = difficultyOrder.find(
    (difficulty) => difficulty.toLowerCase() === value.trim().toLowerCase()
  );

  return matched || fallback;
};

const normalizeConfidenceLevel = (value, fallback = "Medium") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const matched = confidenceLevels.find(
    (confidence) => confidence.toLowerCase() === value.trim().toLowerCase()
  );

  return matched || fallback;
};

const normalizeTopicDepth = (value, fallback = "Working") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const matched = topicDepthLevels.find(
    (depth) => depth.toLowerCase() === value.trim().toLowerCase()
  );

  return matched || fallback;
};

const buildQuestionFingerprint = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((token) => token.length > 2)
    .slice(0, 14)
    .join(" ");

const buildQuestionHistory = (qaHistory = []) =>
  qaHistory.map((item, index) => ({
    sequence: index + 1,
    question: item.question,
    answer: item.answer,
    difficulty: item.difficulty,
    score: item.score,
    topicFocus: item.topicFocus,
    topicDepth: item.topicDepth,
    confidenceLevel: item.confidenceLevel,
    followUpIntent: item.followUpIntent,
    questionFingerprint: buildQuestionFingerprint(item.question)
  }));

const scoreDifficultyOffset = (score, confidenceLevel) => {
  if (score >= 8.5 && confidenceLevel === "High") {
    return 1;
  }

  if (score <= 4.5 || confidenceLevel === "Low") {
    return -1;
  }

  return 0;
};

const topicDepthDifficultyOffset = (topicDepth, followUpIntent) => {
  if (followUpIntent === "deepen" && topicDepth !== "Surface") {
    return 0;
  }

  if (followUpIntent === "escalate") {
    return 1;
  }

  if (followUpIntent === "recover") {
    return -1;
  }

  return 0;
};

const decideNextDifficulty = ({
  currentDifficulty,
  score,
  confidenceLevel,
  topicDepth,
  followUpIntent
}) => {
  const normalizedCurrent = normalizeDifficulty(currentDifficulty);
  const currentIndex = difficultyOrder.indexOf(normalizedCurrent);
  const suggestedIndex =
    currentIndex +
    scoreDifficultyOffset(score, confidenceLevel) +
    topicDepthDifficultyOffset(topicDepth, followUpIntent);

  return difficultyOrder[clampDifficultyIndex(suggestedIndex)];
};

const ensureUniqueNextQuestion = (question, answeredHistory = [], fallbackQuestion) => {
  const nextFingerprint = buildQuestionFingerprint(question);
  const existingFingerprints = new Set(
    answeredHistory.map((item) => buildQuestionFingerprint(item.question))
  );

  if (!nextFingerprint || existingFingerprints.has(nextFingerprint)) {
    return fallbackQuestion;
  }

  return question;
};

const normalizeFollowUpIntent = (value, score = 0) => {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (["deepen", "pivot", "recover", "escalate", "validate"].includes(normalized)) {
    return normalized;
  }

  if (score >= 8) {
    return "deepen";
  }

  if (score <= 4.5) {
    return "recover";
  }

  return "validate";
};

module.exports = {
  buildQuestionFingerprint,
  buildQuestionHistory,
  decideNextDifficulty,
  ensureUniqueNextQuestion,
  normalizeConfidenceLevel,
  normalizeDifficulty,
  normalizeFollowUpIntent,
  normalizeTopicDepth
};
