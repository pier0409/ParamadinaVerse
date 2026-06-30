const Like = require("../models/Like");
const Artwork = require("../models/Artwork");
const Notification = require("../models/Notification");
const logActivity = require("../utils/activityLogger");

// POST /api/likes - Like an artwork
exports.likeArtwork = async (req, res) => {
  try {
    const { artwork_id, artworkId, artwork: bodyArtwork } = req.body;
    const targetArtworkId = artwork_id || artworkId || bodyArtwork;

    if (!targetArtworkId) {
      return res.status(400).json({
        message: "Artwork ID wajib diisi",
      });
    }

    const artwork = await Artwork.findById(targetArtworkId);
    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    // Check if already liked
    const alreadyLiked = await Like.findOne({ artwork: artwork._id, user: req.user._id });
    if (alreadyLiked) {
      return res.status(400).json({
        message: "Anda sudah menyukai karya ini",
      });
    }

    // Create like record
    const like = await Like.create({
      artwork: artwork._id,
      user: req.user._id,
    });

    // Update likes array in Artwork model
    if (!artwork.likes.includes(req.user._id)) {
      artwork.likes.push(req.user._id);
      await artwork.save();
    }

    // Send notification to creator (if not the one liking it)
    if (artwork.created_by.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: artwork.created_by,
        title: "Karya Disukai",
        message: `${req.user.name} menyukai karya Anda: "${artwork.title}"`,
        type: "artwork_like",
        karya: artwork._id,
        judulKarya: artwork.title,
        tanggalPengajuan: artwork.createdAt,
        status: artwork.status,
      });
    }

    await logActivity(req.user._id, "LIKE_ARTWORK", `Liked artwork "${artwork.title}"`, req);

    res.status(201).json({
      message: "Karya berhasil disukai",
      like,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/likes/:id - Unlike an artwork
// Supports id being the Like document ID OR the Artwork ID
exports.unlikeArtwork = async (req, res) => {
  try {
    const idParam = req.params.id;

    let like = await Like.findById(idParam);
    if (!like) {
      // Try treating the param as the artwork ID and search for the like relation
      like = await Like.findOne({ artwork: idParam, user: req.user._id });
    }

    if (!like) {
      return res.status(404).json({
        message: "Data like tidak ditemukan",
      });
    }

    // Authorization: Must be the user who liked
    if (like.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Anda tidak diizinkan membatalkan like untuk user lain",
      });
    }

    const artwork = await Artwork.findById(like.artwork);
    if (artwork) {
      // Remove user ID from Artwork likes array
      artwork.likes = artwork.likes.filter((userId) => userId.toString() !== req.user._id.toString());
      await artwork.save();
    }

    await logActivity(req.user._id, "UNLIKE_ARTWORK", `Unliked artwork "${artwork?.title || 'Unknown'}"`, req);

    await like.deleteOne();

    res.json({
      message: "Batal menyukai karya",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
