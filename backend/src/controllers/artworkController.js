const mongoose = require("mongoose");
const Artwork = require("../models/Artwork");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const logActivity = require("../utils/activityLogger");

// GET /api/artworks - List accepted artworks with search, filter, and sorting
exports.getAllArtworks = async (req, res) => {
  try {
    const { category, search, sort, creator } = req.query;

    let filter = { status: "accepted" };

    // Filter by creator
    if (creator) {
      filter.created_by = creator;
    }

    // Filter by category
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          // If no category found with that slug, return empty
          return res.json([]);
        }
      }
    }

    // Search query
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { programStudi: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 }; // Default: latest

    if (sort === "popular") {
      // Sort by likes count
      sortOptions = { likesCount: -1, createdAt: -1 };
    } else if (sort === "views") {
      sortOptions = { views: -1, createdAt: -1 };
    }

    // Retrieve artworks
    let query = Artwork.find(filter)
      .populate("created_by", "name username email photo prodi fakultas angkatan")
      .populate("category", "name slug description");

    if (sort === "popular") {
      // Use aggregation for sorting by likes length if needed, or sort in memory/add virtual likesCount
      // Mongoose aggregation or simpler: find and sort in javascript, or project likes length.
      // Let's do aggregation for complex sorting or just simple Mongoose query
    }

    let artworks = await query.exec();

    if (sort === "popular") {
      artworks = artworks.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));
    }

    res.json(artworks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/artworks/:id - Get detail of an artwork + increment views
exports.getArtworkDetail = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate("created_by", "name username email photo prodi fakultas angkatan")
      .populate("category", "name slug description");

    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    // Authorization check if not accepted
    if (artwork.status !== "accepted") {
      const isOwner = req.user && req.user._id.toString() === artwork.created_by._id.toString();
      const isAdmin = req.user && req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message: "Anda tidak memiliki izin untuk melihat karya yang belum disetujui",
        });
      }
    }

    // Increment views
    artwork.views = (artwork.views || 0) + 1;
    await artwork.save();

    // Get comments for this artwork
    const comments = await Comment.find({ artwork: artwork._id })
      .populate("user", "name username photo email")
      .sort({ createdAt: 1 });

    res.json({
      artwork,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/artworks - Create/Upload artwork (Mahasiswa or Admin)
exports.createArtwork = async (req, res) => {
  try {
    const { title, description, category, programStudi, teknik, durasi } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Judul dan deskripsi karya wajib diisi",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File gambar karya wajib diunggah",
      });
    }

    // Look up category
    let categoryId = null;
    let categoryName = "";
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        const foundCategory = await Category.findById(category);
        if (foundCategory) {
          categoryId = foundCategory._id;
          categoryName = foundCategory.name;
        }
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: category.toLowerCase() },
            { name: new RegExp("^" + category + "$", "i") },
          ],
        });
        if (foundCategory) {
          categoryId = foundCategory._id;
          categoryName = foundCategory.name;
        }
      }
    }

    const artwork = await Artwork.create({
      title,
      description,
      category: categoryId,
      categoryName: categoryName || category,
      image_url: req.file.path,
      thumbnail: req.file.path, // using same Cloudinary link
      created_by: req.user._id,
      status: "pending",
      programStudi: programStudi || req.user.prodi || "",
      teknik: teknik || "",
      durasi: durasi || "",
    });

    await logActivity(req.user._id, "CREATE_ARTWORK", `Uploaded artwork "${title}"`, req);

    res.status(201).json({
      message: "Karya berhasil diunggah dan sedang menunggu persetujuan admin",
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/artworks/:id - Update artwork details (Owner or Admin)
exports.updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    const isOwner = req.user && req.user._id.toString() === artwork.created_by.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk mengupdate karya ini",
      });
    }

    artwork.title = req.body.title || req.body.judul || artwork.title;
    artwork.description = req.body.description || req.body.deskripsi || artwork.description;
    artwork.programStudi = req.body.programStudi || artwork.programStudi;
    artwork.teknik = req.body.teknik || artwork.teknik;
    artwork.durasi = req.body.durasi || artwork.durasi;

    if (req.file) {
      artwork.image_url = req.file.path;
      artwork.thumbnail = req.file.path;
    }

    // Resolve category if updating it
    if (req.body.category) {
      const category = req.body.category;
      if (mongoose.Types.ObjectId.isValid(category)) {
        const foundCategory = await Category.findById(category);
        if (foundCategory) {
          artwork.category = foundCategory._id;
          artwork.categoryName = foundCategory.name;
        }
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: category.toLowerCase() },
            { name: new RegExp("^" + category + "$", "i") },
          ],
        });
        if (foundCategory) {
          artwork.category = foundCategory._id;
          artwork.categoryName = foundCategory.name;
        }
      }
    }

    // If artwork was rejected and is updated, automatically reset to pending for review
    if (artwork.status === "rejected") {
      artwork.status = "pending";
      artwork.reject_reason = "";
    }

    await artwork.save();

    await logActivity(req.user._id, "UPDATE_ARTWORK", `Updated artwork "${artwork.title}"`, req);

    res.json({
      message: "Karya berhasil diupdate",
      artwork,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/artworks/:id - Delete artwork, comments, and likes (Owner or Admin)
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    const isOwner = req.user && req.user._id.toString() === artwork.created_by.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk menghapus karya ini",
      });
    }

    // Delete comments
    await Comment.deleteMany({ artwork: artwork._id });

    // Delete likes
    await Like.deleteMany({ artwork: artwork._id });

    await logActivity(req.user._id, "DELETE_ARTWORK", `Deleted artwork "${artwork.title}"`, req);

    await artwork.deleteOne();

    res.json({
      message: "Karya berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
