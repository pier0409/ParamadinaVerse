const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getAllReviews,
  approveArtwork,
  rejectArtwork,
} = require("../controllers/reviewController");

// Protect all routes to Admin only
router.use(protect);
router.use(protect.restrictTo("admin"));

router.get("/", getAllReviews);
router.post("/:id/approve", approveArtwork);
router.post("/:id/reject", rejectArtwork);

module.exports = router;
