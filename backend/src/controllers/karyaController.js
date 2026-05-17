const Karya = require("../models/Karya");
const Notification = require("../models/Notification");

exports.uploadKarya = async (req, res) => {
  try {
    const karya = await Karya.create({
      user: req.user._id,
      judul: req.body.judul,
      kategori: req.body.kategori,
      programStudi: req.body.programStudi,
      teknik: req.body.teknik,
      durasi: req.body.durasi,
      deskripsi: req.body.deskripsi,
      imageUrl: req.file.path,
      status: "pending",
    });

    res.status(201).json({
      message: "Karya berhasil dikirim dan menunggu persetujuan admin",
      karya,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.acceptKarya = async (req, res) => {
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
      message: "Karya berhasil diterima",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deniedKarya = async (req, res) => {
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

exports.getAllKarya = async (req, res) => {
  try {
    const search = req.query.search || "";

    const karya = await Karya.find({
      $or: [
        {
          judul: { $regex: search, $options: "i" },
        },
      ],
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(karya);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDetailKarya = async (req, res) => {
  try {
    const karya = await Karya.findById(req.params.id)
      .populate("user", "username")
      .populate("komentar.user", "username");

    res.json(karya);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
