const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const protectOptional = require("../middleware/protectOptional");
const {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Admin only user list
router.get("/", protect, protect.restrictTo("admin"), getAllUsers);

// Public profile (optional auth)
router.get("/:id", protectOptional, getUserProfile);

// Update user details (Self or Admin)
router.put("/:id", protect, updateUser);

// Delete user cascade (Admin only)
router.delete("/:id", protect, protect.restrictTo("admin"), deleteUser);

module.exports = router;
