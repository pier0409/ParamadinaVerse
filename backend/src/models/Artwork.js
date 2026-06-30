const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      alias: "judul",
    },
    description: {
      type: String,
      required: true,
      alias: "deskripsi",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryName: {
      type: String,
      alias: "kategori",
    },
    image_url: {
      type: String,
      required: true,
      alias: "imageUrl",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "user",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      set: function (v) {
        if (v === "denied") return "rejected";
        return v;
      },
    },
    reject_reason: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    programStudi: {
      type: String,
      default: "",
    },
    teknik: {
      type: String,
      default: "",
    },
    durasi: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Artwork", artworkSchema);
