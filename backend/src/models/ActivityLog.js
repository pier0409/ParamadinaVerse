const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      alias: "user_id",
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    ip_address: {
      type: String,
      default: "",
      alias: "ipAddress",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
