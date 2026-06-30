const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
      alias: "artwork_id",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "admin_id",
    },
    status: {
      type: String,
      enum: ["accepted", "rejected"],
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    reviewed_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Review", reviewSchema);
