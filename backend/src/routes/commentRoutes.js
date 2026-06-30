const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getCommentsByArtwork,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

// Public route to view comments
router.get("/:artworkId", getCommentsByArtwork);

// Protected routes to write/delete comments
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
