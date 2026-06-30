const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// All notification routes require authentication
router.use(protect);

router.get("/", getNotifications);
router.put("/read/:id", markAsRead);

module.exports = router;
