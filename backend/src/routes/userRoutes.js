const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const protectOptional = require("../middleware/protectOptional");

const {
  updateProfile,
  getUserProfile,
} = require("../controllers/userController");

router.put("/profile", protect, updateProfile);

router.get("/:id", protectOptional, getUserProfile);

module.exports = router;
