const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const protectOptional = require("../middleware/protectOptional");
const upload = require("../middleware/uploadMiddleware");
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// Public (with optional auth to detect admin)
router.get("/", protectOptional, getAnnouncements);

// Protected Admin only routes
router.post("/", protect, protect.restrictTo("admin"), upload.single("image"), createAnnouncement);
router.put("/:id", protect, protect.restrictTo("admin"), upload.single("image"), updateAnnouncement);
router.delete("/:id", protect, protect.restrictTo("admin"), deleteAnnouncement);

module.exports = router;
