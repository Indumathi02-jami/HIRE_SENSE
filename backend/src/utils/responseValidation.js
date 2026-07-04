const DEFAULT_VALIDATION_CONFIG = {
  minWords: 8,
  minChars: 40,
  maxRepeatedCharRatio: 0.42,
  maxRepeatedWordRatio: 0.45,
  minLexicalDiversity: 0.45,
  minVowelRatio: 0.20,
  maxNonWordRatio: 0.45
};

const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");

const tokenizeWords = (text = "") =>
  text
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9']+/g, ""))
    .filter(Boolean);

const countUniqueWords = (words = []) => new Set(words.map((word) => word.toLowerCase())).size;

const vowelRatio = (text = "") => {
  const letters = (text.match(/[a-zA-Z]/g) || []).join("");
  if (!letters.length) {
    return 0;
  }
  const vowels = (letters.match(/[aeiouy]/gi) || []).length;
  return vowels / letters.length;
};

const isOnlyNumbersOrSymbols = (text = "") => /^[\s\d\W_]+$/.test(text);

const hasKeyboardMash = (text = "") => {
  const normalized = text.toLowerCase();
  const patterns = [
    /qwerty|asdf|zxcv|hjkl|nmnh|ghj|jkl|poiu|lkjh|mnbv|qazwsx|wsxedc|edcrfv|qwer|asdf|zxcv/i
  ];
  return patterns.some((pattern) => pattern.test(normalized));
};

const countRepeatedSequences = (text = "") => {
  const letters = text.replace(/\s+/g, "");
  const repeatedMatches = letters.match(/(.)\1{3,}/g) || [];
  return repeatedMatches.reduce((sum, segment) => sum + segment.length, 0);
};

const hasMostlyRepeatedCharacters = (text = "", config = DEFAULT_VALIDATION_CONFIG) => {
  const normalized = text.replace(/\s+/g, "");
  if (!normalized.length) {
    return false;
  }
  const repeatedChars = countRepeatedSequences(normalized);
  return repeatedChars / normalized.length >= config.maxRepeatedCharRatio;
};

const hasExcessRepeatedWords = (words = [], config = DEFAULT_VALIDATION_CONFIG) => {
  if (!words.length) {
    return false;
  }

  const frequency = words.reduce((acc, word) => {
    const normalized = word.toLowerCase();
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});

  return Object.values(frequency).some((count) => count / words.length >= config.maxRepeatedWordRatio);
};

const hasLowLexicalDiversity = (words = [], config = DEFAULT_VALIDATION_CONFIG) => {
  if (words.length < 4) {
    return true;
  }

  const uniqueWords = countUniqueWords(words);
  return uniqueWords / words.length < config.minLexicalDiversity;
};

const hasTooFewMeaningfulWords = (words = [], config = DEFAULT_VALIDATION_CONFIG) => words.length < config.minWords;

const hasTooFewMeaningfulCharacters = (text = "", config = DEFAULT_VALIDATION_CONFIG) =>
  text.replace(/\s+/g, "").length < config.minChars;

const hasLowVowelDensity = (text = "", config = DEFAULT_VALIDATION_CONFIG) => vowelRatio(text) < config.minVowelRatio;

const validateResponse = (rawText = "", config = {}) => {
  const validationConfig = { ...DEFAULT_VALIDATION_CONFIG, ...config };
  const text = normalizeText(rawText);

  if (!text) {
    return {
      isValid: false,
      status: "Insufficient Response",
      reason: "Meaningless or extremely short response detected."
    };
  }

  const words = tokenizeWords(text);
  const cleanedCharacterCount = text.replace(/\s+/g, "").length;

  if (isOnlyNumbersOrSymbols(text)) {
    return {
      isValid: false,
      status: "Insufficient Response",
      reason: "Meaningless or extremely short response detected."
    };
  }

  if (
    hasTooFewMeaningfulWords(words, validationConfig) ||
    hasTooFewMeaningfulCharacters(text, validationConfig) ||
    hasKeyboardMash(text) ||
    hasMostlyRepeatedCharacters(text, validationConfig) ||
    hasExcessRepeatedWords(words, validationConfig) ||
    hasLowLexicalDiversity(words, validationConfig) ||
    hasLowVowelDensity(text, validationConfig)
  ) {
    return {
      isValid: false,
      status: "Insufficient Response",
      reason: "Meaningless or extremely short response detected."
    };
  }

  return {
    isValid: true,
    status: "Valid Response",
    reason: "Response is sufficient for communication analysis."
  };
};

module.exports = {
  validateResponse,
  tokenizeWords,
  normalizeText
};
