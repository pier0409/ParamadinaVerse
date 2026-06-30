const Announcement = require("../models/Announcement");
const logActivity = require("../utils/activityLogger");

// GET /api/announcements - Get all active announcements/banners
exports.getAnnouncements = async (req, res) => {
  try {
    const { all } = req.query;
    let query = { is_active: true };

    // If 'all=true' is requested by an admin, return both active and inactive
    if (all === "true" && req.user && req.user.role === "admin") {
      query = {};
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/announcements - Create announcement (Admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, image, is_active } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Judul pengumuman wajib diisi",
      });
    }

    const announcement = await Announcement.create({
      title,
      description,
      image: image || (req.file ? req.file.path : ""),
      is_active: is_active !== undefined ? is_active : true,
    });

    await logActivity(req.user._id, "CREATE_ANNOUNCEMENT", `Created announcement: "${title}"`, req);

    res.status(201).json({
      message: "Pengumuman berhasil dibuat",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/announcements/:id - Update announcement (Admin only)
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Pengumuman tidak ditemukan",
      });
    }

    announcement.title = req.body.title || announcement.title;
    announcement.description = req.body.description || announcement.description;
    announcement.image = req.body.image || (req.file ? req.file.path : announcement.image);

    if (req.body.is_active !== undefined) {
      announcement.is_active = req.body.is_active;
    }

    await announcement.save();

    await logActivity(req.user._id, "UPDATE_ANNOUNCEMENT", `Updated announcement ID ${announcement._id}`, req);

    res.json({
      message: "Pengumuman berhasil diupdate",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/announcements/:id - Delete announcement (Admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Pengumuman tidak ditemukan",
      });
    }

    await logActivity(req.user._id, "DELETE_ANNOUNCEMENT", `Deleted announcement: "${announcement.title}"`, req);

    await announcement.deleteOne();

    res.json({
      message: "Pengumuman berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
