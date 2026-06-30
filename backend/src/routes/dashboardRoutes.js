const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getStatistics,
  getRecentArtworks,
  getRecentUsers,
} = require("../controllers/dashboardController");

// All dashboard endpoints require Admin access
router.use(protect);
router.use(protect.restrictTo("admin"));

router.get("/statistics", getStatistics);
router.get("/recent-artworks", getRecentArtworks);
router.get("/recent-users", getRecentUsers);

module.exports = router;
