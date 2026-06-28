const express = require("express");

const resumeController = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const { handleResumeUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", protect, handleResumeUpload, resumeController.uploadResume);
router.get("/history", protect, resumeController.getResumeHistory);

module.exports = router;
