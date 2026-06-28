const { extractTextFromPdf } = require("./pdfService");
const groqService = require("./groqService");

const buildTextPreview = (resumeText) => resumeText.slice(0, 420);

const analyzeResumeForInterview = async (file) => {
  const extractedText = await extractTextFromPdf(file.buffer);
  const resumeProfile = await groqService.analyzeResumeProfile(extractedText);

  return {
    originalName: file.originalname,
    rawTextPreview: buildTextPreview(extractedText),
    resumeProfile
  };
};

module.exports = {
  analyzeResumeForInterview
};
