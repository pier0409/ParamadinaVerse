const mongoose = require("mongoose");

const komentarSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comment: String,
  },
  {
    timestamps: true,
  },
);

const karyaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    judul: {
      type: String,
      required: true,
    },

    kategori: {
      type: String,
      required: true,
    },

    programStudi: {
      type: String,
      required: true,
    },

    teknik: {
      type: String,
      required: true,
    },

    durasi: {
      type: String,
      required: true,
    },

    deskripsi: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "denied"],
      default: "pending",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    komentar: [komentarSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Karya", karyaSchema);
