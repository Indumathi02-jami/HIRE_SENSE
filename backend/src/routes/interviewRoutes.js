const express = require("express");

const interviewController = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");
const { handleResumeUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/analyze-resume", protect, handleResumeUpload, interviewController.analyzeResume);
router.post("/start", protect, interviewController.startInterview);
router.post("/answer", protect, interviewController.submitAnswer);
router.post("/end", protect, interviewController.endInterview);
router.get("/reports/:reportId", protect, interviewController.getReport);

module.exports = router;
