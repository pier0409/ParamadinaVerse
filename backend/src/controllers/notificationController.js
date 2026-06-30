const Notification = require("../models/Notification");

// GET /api/notifications - Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("karya", "title image_url")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/notifications/read/:id - Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notifikasi tidak ditemukan",
      });
    }

    // Authorization check
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk menandai notifikasi ini",
      });
    }

    notification.is_read = true;
    await notification.save();

    res.json({
      message: "Notifikasi berhasil ditandai sebagai dibaca",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
