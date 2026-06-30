const User = require("../models/User");
const Artwork = require("../models/Artwork");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const RefreshToken = require("../models/RefreshToken");
const logActivity = require("../utils/activityLogger");

// GET /api/users - List all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, prodi, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (prodi) query.prodi = prodi;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { nim: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const totalArtwork = await Artwork.countDocuments({
          created_by: user._id,
          status: "accepted",
        });

        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          prodi: user.prodi,
          fakultas: user.fakultas,
          angkatan: user.angkatan,
          status: user.status,
          totalArtwork,
          createdAt: user.createdAt,
        };
      })
    );

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/users/:id - Get user profile and their accepted artworks
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    let filter = {
      created_by: user._id,
    };

    // If requester is not the owner and not an admin, only show accepted artworks
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      filter.status = "accepted";
    }

    const artworks = await Artwork.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    // Calculate statistics from accepted artworks
    const acceptedArtworks = artworks.filter((item) => item.status === "accepted");
    const totalArtwork = acceptedArtworks.length;

    let totalLikes = 0;
    acceptedArtworks.forEach((item) => {
      totalLikes += item.likes ? item.likes.length : 0;
    });

    // Count how many comments are on their accepted artworks
    const artworkIds = acceptedArtworks.map((a) => a._id);
    const totalComments = await Comment.countDocuments({ artwork: { $in: artworkIds } });

    res.json({
      user,
      statistik: {
        totalArtwork,
        totalLikes,
        totalComments,
      },
      artworks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/users/:id - Update user (Admin or Self)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Authorization: Must be owner or admin
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk mengupdate user ini",
      });
    }

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.prodi = req.body.prodi || user.prodi;
    user.fakultas = req.body.fakultas || user.fakultas;
    user.angkatan = req.body.angkatan || user.angkatan;
    user.semester = req.body.semester || user.semester;
    user.nim = req.body.nim || user.nim;
    user.photo = req.body.photo || user.photo;
    user.bio = req.body.bio || req.body.description || user.bio;
    user.description = req.body.description || req.body.bio || user.description;
    user.instagram = req.body.instagram || user.instagram;
    user.linkedin = req.body.linkedin || user.linkedin;

    // Only admin can update role and status
    if (isAdmin) {
      if (req.body.role) user.role = req.body.role;
      if (req.body.status) user.status = req.body.status;
    }

    await user.save();

    await logActivity(
      req.user._id,
      "UPDATE_USER",
      `Updated user profile for ${user.email} (updated by ${req.user.email})`,
      req
    );

    res.json({
      message: "Profil user berhasil diupdate",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/users/:id - Delete user and their related documents (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Delete all artworks created by this user
    const artworks = await Artwork.find({ created_by: user._id });
    const artworkIds = artworks.map((a) => a._id);

    // Delete comments on user's artworks and comments written by this user
    await Comment.deleteMany({
      $or: [{ artwork: { $in: artworkIds } }, { user: user._id }],
    });

    // Delete likes on user's artworks and likes given by this user
    await Like.deleteMany({
      $or: [{ artwork: { $in: artworkIds } }, { user: user._id }],
    });

    // Delete all user's artworks
    await Artwork.deleteMany({ created_by: user._id });

    // Delete all refresh tokens
    await RefreshToken.deleteMany({ user: user._id });

    // Log action
    await logActivity(
      req.user._id,
      "DELETE_USER",
      `Deleted user ${user.email} and all their artworks, comments, likes`,
      req
    );

    // Delete the user
    await user.deleteOne();

    res.json({
      message: "User dan semua karyanya berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
