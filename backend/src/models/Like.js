const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
      alias: "artwork_id",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "user_id",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate likes
likeSchema.index({ artwork: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
