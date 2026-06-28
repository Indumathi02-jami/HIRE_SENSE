const { GoogleGenAI } = require("@google/genai");

const { env } = require("../config/env");
const AppError = require("../utils/AppError");

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey
});

const MAX_RESUME_TEXT_CHARS = 18000;

const analysisSchema = {
  type: "object",
  properties: {
    experienceLevel: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    technologies: { type: "array", items: { type: "string" } },
    projectDomains: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    weakAreas: { type: "array", items: { type: "string" } },
    recommendedRoles: { type: "array", items: { type: "string" } }
  },
  required: [
    "experienceLevel",
    "skills",
    "technologies",
    "projectDomains",
    "strengths",
    "weakAreas",
    "recommendedRoles"
  ]
};

const buildPrompt = (resumeText) => `You are an expert technical recruiter analyzing a candidate's resume. Extract the following information and return it strictly as a JSON object with this exact schema, with no markdown formatting or extra text:
{
  "experienceLevel": "String (e.g., Junior, Mid-Level, Senior)",
  "skills": ["Array of soft and general skills"],
  "technologies": ["Array of specific programming languages, frameworks, and tools"],
  "projectDomains": ["Array of industries or domains worked in, e.g., FinTech, E-commerce"],
  "strengths": ["Array of 2-3 brief recruiter-perspective strengths"],
  "weakAreas": ["Array of 1-2 potential areas for growth or missing common skills"],
  "recommendedRoles": ["Array of 2-3 suitable job titles"]
}

Resume text:
${resumeText}`;

const trimResumeTextForAnalysis = (resumeText = "") => {
  const normalizedText = resumeText.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= MAX_RESUME_TEXT_CHARS) {
    return normalizedText;
  }

  const head = normalizedText.slice(0, 12000);
  const tail = normalizedText.slice(-6000);

  return `${head}\n\n[Resume content truncated for analysis]\n\n${tail}`;
};

const coerceStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const normalizeAnalysis = (payload = {}) => ({
  experienceLevel:
    typeof payload.experienceLevel === "string" && payload.experienceLevel.trim()
      ? payload.experienceLevel.trim()
      : "Not specified",
  skills: coerceStringArray(payload.skills),
  technologies: coerceStringArray(payload.technologies),
  projectDomains: coerceStringArray(payload.projectDomains),
  strengths: coerceStringArray(payload.strengths),
  weakAreas: coerceStringArray(payload.weakAreas),
  recommendedRoles: coerceStringArray(payload.recommendedRoles)
});

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

const isInvalidRequestError = (error) => {
  const message = (error?.message || "").toLowerCase();

  return (
    message.includes("invalid argument") ||
    message.includes("request contains an invalid argument") ||
    message.includes("token count") ||
    message.includes("too many tokens") ||
    message.includes("context length") ||
    message.includes("request is too large")
  );
};

const analyzeResumeText = async (resumeText) => {
  try {
    const preparedResumeText = trimResumeTextForAnalysis(resumeText);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: buildPrompt(preparedResumeText),
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    return normalizeAnalysis(safeParseJson(response.text || ""));
  } catch (error) {
    const statusCode = extractStatusCode(error);

    if (process.env.NODE_ENV !== "production") {
      console.error("Gemini analysis failed:", {
        statusCode,
        message: error?.message,
        error
      });
    }

    if (statusCode === 429) {
      throw new AppError(
        "Resume analysis quota exceeded. Please try again in a few minutes.",
        429
      );
    }

    if (statusCode === 400 && isInvalidRequestError(error)) {
      throw new AppError(
        "This resume is too large or complex for a single AI analysis request. Please try a shorter PDF.",
        400
      );
    }

    if (statusCode === 401 || statusCode === 403) {
      throw new AppError(
        "HireSense AI could not authenticate with Gemini. Please verify the GEMINI_API_KEY configuration.",
        500
      );
    }

    if (statusCode === 400) {
      throw new AppError(
        "HireSense AI could not process the Gemini analysis request. Please verify the API configuration and try again.",
        500
      );
    }

    if (error instanceof SyntaxError) {
      throw new AppError(
        "HireSense AI could not understand the AI analysis response. Please try again.",
        500
      );
    }

    throw new AppError(
      "HireSense AI could not analyze this resume right now. Please try again shortly.",
      500
    );
  }
};

module.exports = {
  analyzeResumeText
};
