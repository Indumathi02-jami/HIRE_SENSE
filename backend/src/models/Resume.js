const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Resume owner is required."],
      index: true
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required."],
      trim: true
    },
    fileName: {
      type: String,
      required: [true, "Stored file name is required."],
      trim: true,
      unique: true
    },
    filePath: {
      type: String,
      required: [true, "Stored file path is required."]
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required."],
      min: [1, "File size must be greater than zero."]
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

resumeSchema.index({ user: 1, uploadDate: -1 });

module.exports = mongoose.model("Resume", resumeSchema);
