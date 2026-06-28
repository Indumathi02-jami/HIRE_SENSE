const { extractTextFromPdf } = require("./pdfService");
const { analyzeResumeText } = require("./groqService");

const buildTextPreview = (resumeText) => resumeText.slice(0, 420);

const analyzeResumeFile = async (file) => {
  const extractedText = await extractTextFromPdf(file.buffer);
  const analysis = await analyzeResumeText(extractedText);

  return {
    originalName: file.originalname,
    rawTextPreview: buildTextPreview(extractedText),
    ...analysis
  };
};

module.exports = {
  analyzeResumeFile
};
