const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "mahasiswa", "guest"],
      default: "mahasiswa",
    },
    prodi: {
      type: String,
      default: "",
    },
    fakultas: {
      type: String,
      default: "",
    },
    angkatan: {
      type: String,
      default: "",
    },
    semester: {
      type: String,
      default: "",
    },
    nim: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Fallbacks/virtuals or hook to keep name and username synced if needed
userSchema.pre("save", function () {
  if (!this.username && this.name) {
    this.username = this.name.toLowerCase().replace(/\s+/g, "");
  }
  if (!this.bio && this.description) {
    this.bio = this.description;
  }
});

module.exports = mongoose.model("User", userSchema);
