const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, dashboardController.getDashboardStats);
router.get("/interviews", protect, dashboardController.getDashboardInterviews);
router.get("/trends", protect, dashboardController.getDashboardTrends);

module.exports = router;
