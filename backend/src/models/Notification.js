const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    karya: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Karya",
      required: true,
    },

    judulKarya: {
      type: String,
      required: true,
    },

    tanggalPengajuan: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["accepted", "denied"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);
