const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const protectOptional = require("../middleware/protectOptional");
const upload = require("../middleware/uploadMiddleware");
const {
  getAllArtworks,
  getArtworkDetail,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} = require("../controllers/artworkController");

// Public routes
router.get("/", getAllArtworks);
router.get("/:id", protectOptional, getArtworkDetail);

// Protected routes (mahasiswa & admin)
router.post("/", protect, protect.restrictTo("mahasiswa", "admin"), upload.single("image"), createArtwork);
router.put("/:id", protect, protect.restrictTo("mahasiswa", "admin"), upload.single("image"), updateArtwork);
router.delete("/:id", protect, protect.restrictTo("mahasiswa", "admin"), deleteArtwork);

module.exports = router;
