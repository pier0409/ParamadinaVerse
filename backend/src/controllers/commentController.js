const Comment = require("../models/Comment");
const Artwork = require("../models/Artwork");
const Notification = require("../models/Notification");
const logActivity = require("../utils/activityLogger");

// GET /api/comments/:artworkId - Get all comments for a specific artwork
exports.getCommentsByArtwork = async (req, res) => {
  try {
    const comments = await Comment.find({ artwork: req.params.artworkId })
      .populate("user", "name username photo prodi email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/comments - Add a comment to an artwork
exports.createComment = async (req, res) => {
  try {
    const { artwork_id, artworkId, artwork: bodyArtwork, comment } = req.body;
    const targetArtworkId = artwork_id || artworkId || bodyArtwork;

    if (!targetArtworkId || !comment) {
      return res.status(400).json({
        message: "Artwork ID dan teks komentar wajib diisi",
      });
    }

    const artwork = await Artwork.findById(targetArtworkId);
    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    const commentDoc = await Comment.create({
      artwork: artwork._id,
      user: req.user._id,
      comment,
    });

    // Populate user info for frontend response
    await commentDoc.populate("user", "name username photo");

    // Notify artwork owner (if they are not the commenter)
    if (artwork.created_by.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: artwork.created_by,
        title: "Komentar Baru",
        message: `${req.user.name} memberikan komentar pada karya Anda: "${comment.length > 30 ? comment.substring(0, 30) + '...' : comment}"`,
        type: "new_comment",
        karya: artwork._id,
        judulKarya: artwork.title,
        tanggalPengajuan: artwork.createdAt,
        status: artwork.status,
      });
    }

    await logActivity(
      req.user._id,
      "ADD_COMMENT",
      `Commented on artwork "${artwork.title}" (Comment ID: ${commentDoc._id})`,
      req
    );

    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      comment: commentDoc,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/comments/:id - Delete a comment (Author, Artwork Owner, or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("artwork");

    if (!comment) {
      return res.status(404).json({
        message: "Komentar tidak ditemukan",
      });
    }

    const isCommentAuthor = req.user._id.toString() === comment.user.toString();
    const isArtworkOwner =
      comment.artwork && req.user._id.toString() === comment.artwork.created_by.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCommentAuthor && !isArtworkOwner && !isAdmin) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk menghapus komentar ini",
      });
    }

    await logActivity(
      req.user._id,
      "DELETE_COMMENT",
      `Deleted comment (ID: ${comment._id}) on artwork "${comment.artwork?.title || 'Unknown'}"`,
      req
    );

    await comment.deleteOne();

    res.json({
      message: "Komentar berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
