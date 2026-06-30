const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "user_id",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // e.g., 'artwork_accepted', 'artwork_rejected', 'new_comment'
    },
    is_read: {
      type: Boolean,
      default: false,
      alias: "isRead",
    },
    // Keep old fields for backward compatibility
    karya: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
    },
    judulKarya: {
      type: String,
    },
    tanggalPengajuan: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
