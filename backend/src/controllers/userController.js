const User = require("../models/User");
const Karya = require("../models/Karya");

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    user.username = req.body.username || user.username;
    user.prodi = req.body.prodi || user.prodi;
    user.semester = req.body.semester || user.semester;
    user.nim = req.body.nim || user.nim;
    user.description = req.body.description || user.description;
    user.instagram = req.body.instagram || user.instagram;
    user.linkedin = req.body.linkedin || user.linkedin;

    await user.save();

    res.json({
      message: "Profile berhasil diupdate",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const karya = await Karya.find({
      user: user._id,
      status: "accepted",
    }).sort({ createdAt: -1 });

    const totalKarya = karya.length;

    let totalLikes = 0;
    let totalKomentar = 0;

    karya.forEach((item) => {
      totalLikes += item.likes.length;
      totalKomentar += item.komentar.length;
    });

    const karyaCards = karya.map((item) => ({
      _id: item._id,
      image: item.imageUrl,
      namaKarya: item.judul,
      prodi: item.programStudi,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      totalLike: item.likes.length,
      totalKomentar: item.komentar.length,
    }));

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        prodi: user.prodi,
        semester: user.semester,
        nim: user.nim,
        description: user.description,
        instagram: user.instagram,
        linkedin: user.linkedin,
      },

      statistik: {
        totalKarya,
        totalLikes,
        totalKomentar,
      },

      karya: karyaCards,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
