const User = require("../models/User");
const Artwork = require("../models/Artwork");
const Like = require("../models/Like");

// GET /api/dashboard/statistics - Get dashboard statistics (Admin only)
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArtworks = await Artwork.countDocuments();
    const pendingReview = await Artwork.countDocuments({ status: "pending" });
    const acceptedArtworks = await Artwork.countDocuments({ status: "accepted" });
    const rejectedArtworks = await Artwork.countDocuments({ status: "rejected" });

    // Calculate total views (sum of views across all artworks)
    const viewsStats = await Artwork.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);
    const totalViews = viewsStats.length > 0 ? viewsStats[0].totalViews : 0;

    // Calculate total likes (using the Like collection)
    const totalLikes = await Like.countDocuments();

    res.json({
      totalUsers,
      totalArtworks,
      pendingReview,
      acceptedArtworks,
      rejectedArtworks,
      totalViews,
      totalLikes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/dashboard/recent-artworks - Get recent artworks (Admin only)
exports.getRecentArtworks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const artworks = await Artwork.find()
      .populate("created_by", "name username email photo prodi")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(artworks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/dashboard/recent-users - Get recent users (Admin only)
exports.getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
