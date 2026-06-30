const Review = require("../models/Review");
const Artwork = require("../models/Artwork");
const Notification = require("../models/Notification");
const logActivity = require("../utils/activityLogger");

// GET /api/reviews - List artworks pending review, or review history (Admin only)
exports.getAllReviews = async (req, res) => {
  try {
    const { status } = req.query; // optional status filter: pending, accepted, rejected
    let filter = {};

    if (status) {
      filter.status = status;
    } else {
      // By default, fetch all that are pending review
      filter.status = "pending";
    }

    const artworks = await Artwork.find(filter)
      .populate("created_by", "name username email prodi fakultas angkatan")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/reviews/:id/approve - Approve artwork (Admin only)
exports.approveArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    if (artwork.status === "accepted") {
      return res.status(400).json({
        message: "Karya ini sudah disetujui sebelumnya",
      });
    }

    artwork.status = "accepted";
    artwork.reject_reason = "";
    await artwork.save();

    // Create Review record
    await Review.create({
      artwork: artwork._id,
      admin: req.user._id,
      status: "accepted",
      note: req.body.note || req.body.reject_reason || "Approved by admin",
    });

    // Create Notification for the creator
    await Notification.create({
      user: artwork.created_by,
      title: "Karya Diterima",
      message: `Selamat! Karya Anda yang berjudul "${artwork.title}" telah diterima oleh admin dan sekarang dapat dilihat publik.`,
      type: "artwork_accepted",
      karya: artwork._id,
      judulKarya: artwork.title,
      tanggalPengajuan: artwork.createdAt,
      status: "accepted",
    });

    await logActivity(
      req.user._id,
      "APPROVE_ARTWORK",
      `Approved artwork "${artwork.title}" created by user ID ${artwork.created_by}`,
      req
    );

    res.json({
      message: "Karya berhasil disetujui",
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/reviews/:id/reject - Reject artwork (Admin only)
exports.rejectArtwork = async (req, res) => {
  try {
    const { note, reject_reason } = req.body;
    const reason = note || reject_reason || "Tidak memenuhi ketentuan galeri";

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    if (artwork.status === "rejected") {
      return res.status(400).json({
        message: "Karya ini sudah ditolak sebelumnya",
      });
    }

    artwork.status = "rejected";
    artwork.reject_reason = reason;
    await artwork.save();

    // Create Review record
    await Review.create({
      artwork: artwork._id,
      admin: req.user._id,
      status: "rejected",
      note: reason,
    });

    // Create Notification for the creator
    await Notification.create({
      user: artwork.created_by,
      title: "Karya Ditolak",
      message: `Maaf, karya Anda yang berjudul "${artwork.title}" ditolak oleh admin dengan alasan: ${reason}`,
      type: "artwork_rejected",
      karya: artwork._id,
      judulKarya: artwork.title,
      tanggalPengajuan: artwork.createdAt,
      status: "rejected",
    });

    await logActivity(
      req.user._id,
      "REJECT_ARTWORK",
      `Rejected artwork "${artwork.title}" created by user ID ${artwork.created_by}. Reason: ${reason}`,
      req
    );

    res.json({
      message: "Karya berhasil ditolak",
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
