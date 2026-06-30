const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // AMBIL USER TERBARU DARI DATABASE
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User pemilik token tidak ditemukan",
        });
      }

      if (user.status === "suspended") {
        return res.status(403).json({
          message: "Akun Anda telah ditangguhkan",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Tidak ada token, otorisasi ditolak",
    });
  }
};

/**
 * Role based access control middleware creator
 * @param  {...string} roles - List of allowed roles
 */
protect.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Otorisasi ditolak, silakan login terlebih dahulu",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses ditolak, peran Anda tidak memiliki izin untuk tindakan ini",
      });
    }

    next();
  };
};

module.exports = protect;
