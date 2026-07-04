const clampScore = (value) => Math.max(0, Math.min(10, Number(value.toFixed(1))));

const fillerVocabulary = [
  "um",
  "uh",
  "like",
  "actually",
  "basically",
  "literally",
  "you know",
  "i mean",
  "sort of",
  "kind of"
];

const confidencePositivePatterns = [
  /\b(i implemented|i built|i designed|i optimized|i improved|i led)\b/gi,
  /\b(for example|for instance|specifically|in production)\b/gi,
  /\bthe tradeoff|because|therefore|as a result\b/gi
];

const confidenceNegativePatterns = [
  /\bmaybe\b/gi,
  /\bi think\b/gi,
  /\bprobably\b/gi,
  /\bnot sure\b/gi,
  /\bguess\b/gi,
  /\bperhaps\b/gi
];

const normalizeText = (value = "") => value.toLowerCase().replace(/\s+/g, " ").trim();

const tokenizeWords = (text = "") =>
  text
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9']/g, ""))
    .filter(Boolean);

const countPatternMatches = (text, patterns) =>
  patterns.reduce((total, pattern) => total + ((text.match(pattern) || []).length), 0);

const collectFillerWords = (text) => {
  const matches = [];
  const normalized = normalizeText(text);

  fillerVocabulary.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const count = (normalized.match(regex) || []).length;

    for (let index = 0; index < count; index += 1) {
      matches.push(term);
    }
  });

  return matches;
};

const buildImprovementFeedback = ({
  fillerWordCount,
  hesitationCount,
  speakingSpeedWpm,
  confidenceScore
}) => {
  const feedback = [];

  if (fillerWordCount >= 6) {
    feedback.push("Reduce filler words by pausing briefly before key points instead of filling silence.");
  }

  if (hesitationCount >= 4) {
    feedback.push("Practice cleaner answer framing so transitions between ideas feel more decisive.");
  }

  if (speakingSpeedWpm > 175) {
    feedback.push("Slow down slightly to improve clarity and let technical explanations land more confidently.");
  } else if (speakingSpeedWpm > 0 && speakingSpeedWpm < 105) {
    feedback.push("Increase speaking pace a little so your answers sound more fluent and assured.");
  }

  if (confidenceScore < 6) {
    feedback.push("Use stronger ownership language and concrete examples to sound more confident.");
  }

  if (!feedback.length) {
    feedback.push("Keep using structured examples and concise tradeoff-based explanations.");
  }

  return feedback.slice(0, 3);
};

const analyzeSpeechCommunication = ({
  transcript = "",
  speechDurationSeconds = 0,
  pauseCount = 0,
  speechActivityRatio = 0,
  averageVolume = 0,
  transcriptSource = "manual"
}) => {
  const normalizedTranscript = transcript.trim();
  const words = tokenizeWords(normalizedTranscript);
  const wordCount = words.length;
  const fillerWords = collectFillerWords(normalizedTranscript);
  const fillerWordCount = fillerWords.length;
  const hesitationCount =
    Number(pauseCount) +
    (normalizedTranscript.match(/\.\.\.|--|, ,/g) || []).length +
    countPatternMatches(normalizedTranscript, [/\b(uh|um|er|ah)\b/gi]);
  const durationSeconds = Math.max(0, Number(speechDurationSeconds) || 0);
  const speakingSpeedWpm =
    durationSeconds > 0 ? Number(((wordCount / durationSeconds) * 60).toFixed(1)) : 0;
  const positiveConfidenceSignals = countPatternMatches(
    normalizedTranscript,
    confidencePositivePatterns
  );
  const negativeConfidenceSignals = countPatternMatches(
    normalizedTranscript,
    confidenceNegativePatterns
  );

  const clarityPenalty = fillerWordCount * 0.28 + hesitationCount * 0.32;
  const pacingBonus =
    speakingSpeedWpm >= 115 && speakingSpeedWpm <= 165 ? 0.8 : speakingSpeedWpm === 0 ? 0 : -0.4;
  const activityBonus = Math.min(1.2, (Number(speechActivityRatio) || 0) * 1.5);
  const volumeBonus = Math.min(0.8, (Number(averageVolume) || 0) * 1.2);

  const communicationScore = clampScore(
    7.2 + pacingBonus + activityBonus + volumeBonus - clarityPenalty
  );
  const confidenceScore = clampScore(
    6.8 +
      positiveConfidenceSignals * 0.45 -
      negativeConfidenceSignals * 0.55 -
      hesitationCount * 0.15 +
      (Number(averageVolume) || 0) * 1.4
  );

  const improvementFeedback = buildImprovementFeedback({
    fillerWordCount,
    hesitationCount,
    speakingSpeedWpm,
    confidenceScore
  });

  return {
    fillerWordCount,
    fillerWords: [...new Set(fillerWords)],
    hesitationCount,
    speakingSpeedWpm,
    speechDurationSeconds: durationSeconds,
    communicationScore,
    confidenceScore,
    confidenceLevel:
      confidenceScore >= 7.5 ? "High" : confidenceScore <= 4.9 ? "Low" : "Medium",
    speechActivityRatio: Math.max(0, Math.min(1, Number(speechActivityRatio) || 0)),
    averageVolume: Math.max(0, Math.min(1, Number(averageVolume) || 0)),
    transcriptSource,
    improvementFeedback
  };
};

const buildInsufficientSpeechAnalysis = ({ transcriptSource = "manual", validationResult = {} } = {}) => ({
  fillerWordCount: 0,
  fillerWords: [],
  hesitationCount: 0,
  speakingSpeedWpm: 0,
  speechDurationSeconds: 0,
  communicationScore: 0,
  confidenceScore: 0,
  confidenceLevel: "Low",
  speechActivityRatio: 0,
  averageVolume: 0,
  transcriptSource,
  status: validationResult.status || "Insufficient Response",
  reason: validationResult.reason || "Response failed validation and was not analyzed.",
  improvementFeedback: [
    "Your answer contained too little meaningful content to generate communication analytics. Please expand with clearer reasoning and examples."
  ]
});

const generateCommunicationAnalytics = (qaHistory = []) => {
  const analytics = qaHistory
    .map((entry) => entry.communicationAnalysis)
    .filter((analysis) => analysis && analysis.speechDurationSeconds > 0);

  if (!analytics.length) {
    return {
      communicationScore: 0,
      confidenceScore: 0,
      fillerWordRate: 0,
      averageSpeakingSpeedWpm: 0,
      hesitationRate: 0,
      improvementFeedback: [
        "Use voice input during the interview to unlock communication analytics feedback."
      ]
    };
  }

  const totals = analytics.reduce(
    (accumulator, item) => ({
      communicationScore: accumulator.communicationScore + item.communicationScore,
      confidenceScore: accumulator.confidenceScore + item.confidenceScore,
      fillerWordCount: accumulator.fillerWordCount + item.fillerWordCount,
      hesitationCount: accumulator.hesitationCount + item.hesitationCount,
      speakingSpeedWpm: accumulator.speakingSpeedWpm + item.speakingSpeedWpm,
      speechDurationSeconds: accumulator.speechDurationSeconds + item.speechDurationSeconds,
      feedback: [...accumulator.feedback, ...(item.improvementFeedback || [])]
    }),
    {
      communicationScore: 0,
      confidenceScore: 0,
      fillerWordCount: 0,
      hesitationCount: 0,
      speakingSpeedWpm: 0,
      speechDurationSeconds: 0,
      feedback: []
    }
  );

  const speakingMinutes = totals.speechDurationSeconds / 60 || 1;
  const rankedFeedback = [...new Set(totals.feedback)].slice(0, 3);

  return {
    communicationScore: clampScore(totals.communicationScore / analytics.length),
    confidenceScore: clampScore(totals.confidenceScore / analytics.length),
    fillerWordRate: Number((totals.fillerWordCount / speakingMinutes).toFixed(1)),
    averageSpeakingSpeedWpm: Number((totals.speakingSpeedWpm / analytics.length).toFixed(1)),
    hesitationRate: Number((totals.hesitationCount / speakingMinutes).toFixed(1)),
    improvementFeedback: rankedFeedback.length
      ? rankedFeedback
      : ["Keep practicing concise, well-paced answers with concrete examples."]
  };
};

module.exports = {
  analyzeSpeechCommunication,
  generateCommunicationAnalytics,
  buildInsufficientSpeechAnalysis
};
