const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: [true, "Associated resume is required."],
      index: true
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required."],
      trim: true
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required."],
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    technologies: {
      type: [String],
      default: []
    },
    projectDomains: {
      type: [String],
      default: []
    },
    strengths: {
      type: [String],
      default: []
    },
    weakAreas: {
      type: [String],
      default: []
    },
    recommendedRoles: {
      type: [String],
      default: []
    },
    rawTextPreview: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
