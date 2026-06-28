const mongoose = require("mongoose");
const crypto = require("crypto");

const allowedDifficulties = ["Beginner", "Intermediate", "Advanced"];
const allowedInterviewTypes = ["Technical", "Behavioral", "System Design", "Mixed"];
const confidenceLevels = ["Low", "Medium", "High"];
const topicDepthLevels = ["Surface", "Working", "Deep"];

const qaEntrySchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      default: "",
      trim: true
    },
    aiFeedback: {
      type: String,
      default: "",
      trim: true
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null
    },
    difficulty: {
      type: String,
      enum: allowedDifficulties,
      required: true
    },
    topicFocus: {
      type: String,
      default: "",
      trim: true
    },
    topicDepth: {
      type: String,
      enum: topicDepthLevels,
      default: "Working"
    },
    confidenceLevel: {
      type: String,
      enum: confidenceLevels,
      default: "Medium"
    },
    followUpIntent: {
      type: String,
      default: "",
      trim: true
    },
    communicationAnalysis: {
      fillerWordCount: {
        type: Number,
        min: 0,
        default: 0
      },
      fillerWords: {
        type: [String],
        default: []
      },
      hesitationCount: {
        type: Number,
        min: 0,
        default: 0
      },
      speakingSpeedWpm: {
        type: Number,
        min: 0,
        default: 0
      },
      speechDurationSeconds: {
        type: Number,
        min: 0,
        default: 0
      },
      communicationScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      confidenceLevel: {
        type: String,
        enum: confidenceLevels,
        default: "Medium"
      },
      speechActivityRatio: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      averageVolume: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      transcriptSource: {
        type: String,
        default: "manual",
        trim: true
      },
      improvementFeedback: {
        type: [String],
        default: []
      }
    },
    answerReview: {
      isCorrect: {
        type: Boolean,
        default: false
      },
      whatWasGood: {
        type: String,
        default: "",
        trim: true
      },
      missingConcepts: {
        type: [String],
        default: []
      },
      idealAnswer: {
        type: String,
        default: "",
        trim: true
      }
    },
    timeTaken: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    _id: false
  }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    configuration: {
      domain: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        enum: allowedDifficulties,
        required: true
      },
      interviewType: {
        type: String,
        enum: allowedInterviewTypes,
        required: true
      }
    },
    resumeProfile: {
      primaryDomain: {
        type: String,
        required: true,
        trim: true
      },
      experienceLevel: {
        type: String,
        required: true,
        trim: true
      },
      interviewFocus: {
        type: String,
        required: true,
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
      domains: {
        type: [String],
        default: []
      },
      frameworks: {
        type: [String],
        default: []
      },
      tools: {
        type: [String],
        default: []
      },
      originalName: {
        type: String,
        default: "",
        trim: true
      }
    },
    qaHistory: {
      type: [qaEntrySchema],
      default: []
    },
    finalReport: {
      type: String,
      default: "",
      trim: true
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: null
    },
    strengths: {
      type: [String],
      default: []
    },
    weakAreas: {
      type: [String],
      default: []
    },
    recommendedTopics: {
      type: [String],
      default: []
    },
    communicationReport: {
      communicationScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      fillerWordRate: {
        type: Number,
        min: 0,
        default: 0
      },
      averageSpeakingSpeedWpm: {
        type: Number,
        min: 0,
        default: 0
      },
      hesitationRate: {
        type: Number,
        min: 0,
        default: 0
      },
      improvementFeedback: {
        type: [String],
        default: []
      }
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

interviewSessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
