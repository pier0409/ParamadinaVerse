const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  likeArtwork,
  unlikeArtwork,
} = require("../controllers/likeController");

// All like operations require authentication
router.use(protect);

router.post("/", likeArtwork);
router.delete("/:id", unlikeArtwork);

module.exports = router;
