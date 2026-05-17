const User = require("../models/User");
const Karya = require("../models/Karya");
const Notification = require("../models/Notification");

/* =========================================
   GET ALL USERS
========================================= */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const totalKarya = await Karya.countDocuments({
          user: user._id,
          status: "accepted",
        });

        return {
          _id: user._id,
          nama: user.username,
          email: user.email,
          role: user.role,
          bergabung: user.createdAt,
          totalKarya,
        };
      }),
    );

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   UPDATE USER ROLE
========================================= */

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    user.role = req.body.role;

    await user.save();

    res.json({
      message: "Role user berhasil diupdate",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   DELETE USER
========================================= */

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await Karya.deleteMany({
      user: user._id,
    });

    await Notification.deleteMany({
      user: user._id,
    });

    await user.deleteOne();

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   GET ALL KARYA
========================================= */

exports.getAllKaryaAdmin = async (req, res) => {
  try {
    const karya = await Karya.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const formattedKarya = karya.map((item) => ({
      _id: item._id,
      karya: item.judul,
      namaMahasiswa: item.user?.username || "Unknown",
      kategoriKarya: item.kategori,

      status:
        item.status === "pending"
          ? "Menunggu Review"
          : item.status === "accepted"
            ? "Disetujui"
            : "Ditolak",

      tanggal: item.createdAt,

      interaksi: {
        likes: item.likes.length,
        komentar: item.komentar.length,
      },

      image: item.imageUrl,
    }));

    res.json(formattedKarya);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   REVIEW KARYA
========================================= */

exports.reviewKarya = async (req, res) => {
  try {
    const karya = await Karya.findById(req.params.id).populate(
      "user",
      "username email",
    );

    if (!karya) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    res.json(karya);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   ACCEPT KARYA
========================================= */

exports.acceptKaryaAdmin = async (req, res) => {
  try {
    const karya = await Karya.findById(req.params.id);

    if (!karya) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    karya.status = "accepted";

    await karya.save();

    await Notification.create({
      user: karya.user,
      karya: karya._id,
      judulKarya: karya.judul,
      tanggalPengajuan: karya.createdAt,
      status: "accepted",
      message: `Karya ${karya.judul} telah diterima oleh admin`,
    });

    res.json({
      message: "Karya berhasil disetujui",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   DENIED KARYA
========================================= */

exports.deniedKaryaAdmin = async (req, res) => {
  try {
    const karya = await Karya.findById(req.params.id);

    if (!karya) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    karya.status = "denied";

    await karya.save();

    await Notification.create({
      user: karya.user,
      karya: karya._id,
      judulKarya: karya.judul,
      tanggalPengajuan: karya.createdAt,
      status: "denied",
      message: `Karya ${karya.judul} ditolak oleh admin`,
    });

    res.json({
      message: "Karya berhasil ditolak",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================
   DELETE KARYA
========================================= */

exports.deleteKaryaAdmin = async (req, res) => {
  try {
    const karya = await Karya.findById(req.params.id);

    if (!karya) {
      return res.status(404).json({
        message: "Karya tidak ditemukan",
      });
    }

    await karya.deleteOne();

    res.json({
      message: "Karya berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
