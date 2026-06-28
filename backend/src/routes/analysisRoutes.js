const express = require("express");

const analysisController = require("../controllers/analysisController");
const { protect } = require("../middleware/authMiddleware");
const { handleResumeUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/resume", protect, handleResumeUpload, analysisController.analyzeResume);

module.exports = router;
