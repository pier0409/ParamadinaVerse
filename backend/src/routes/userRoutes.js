const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  updateProfile,
  getUserProfile,
} = require("../controllers/userController");

router.put("/profile", protect, updateProfile);

router.get("/:id", getUserProfile);

module.exports = router;
