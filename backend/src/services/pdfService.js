const pdfParse = require("pdf-parse");

const AppError = require("../utils/AppError");

const extractTextFromPdf = async (fileBuffer) => {
  try {
    const parsedDocument = await pdfParse(fileBuffer);
    const cleanedText = (parsedDocument.text || "")
      .replace(/\u0000/g, " ")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    if (!cleanedText) {
      throw new AppError("We could not extract readable text from this PDF resume.", 400);
    }

    return cleanedText;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("We could not extract readable text from this PDF resume.", 400);
  }
};

module.exports = {
  extractTextFromPdf
};
