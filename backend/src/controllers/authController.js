const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const logActivity = require("../utils/activityLogger");

const adminEmails = [
  "prila.rizqi@students.paramadina.ac.id",
  "fadhil.husein@students.paramadina.ac.id",
  "najjuan.fariz@students.paramadina.ac.id",
];

// Helper to generate a refresh token
const generateAndSaveRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
};

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Validate email domain
    const paramadinaEmailRegex = /^[a-zA-Z0-9._%+-]+@(students\.)?paramadina\.ac\.id$/i;
    if (!paramadinaEmailRegex.test(email)) {
      return res.status(400).json({
        message: "Email harus menggunakan domain kampus (@paramadina.ac.id atau @students.paramadina.ac.id)",
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    let role = "mahasiswa";
    if (adminEmails.includes(email.toLowerCase())) {
      role = "admin";
    }

    let finalPassword = password;
    if (role === "admin" && process.env.ADMIN_PASSWORD) {
      finalPassword = process.env.ADMIN_PASSWORD;
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const user = await User.create({
      name,
      username: username || name.toLowerCase().replace(/\s+/g, ""),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    await logActivity(user._id, "REGISTER", `User registered as ${role}`, req);

    const token = generateToken(user._id);
    const refreshToken = await generateAndSaveRefreshToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "User tidak ditemukan",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Akun Anda telah ditangguhkan. Silakan hubungi admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    await logActivity(user._id, "LOGIN", "User logged in successfully", req);

    const token = generateToken(user._id);
    const refreshToken = await generateAndSaveRefreshToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    if (req.user) {
      await logActivity(req.user._id, "LOGOUT", "User logged out successfully", req);
    }

    res.json({
      message: "Berhasil logout",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.prodi = req.body.prodi || user.prodi;
    user.fakultas = req.body.fakultas || user.fakultas;
    user.angkatan = req.body.angkatan || user.angkatan;
    user.semester = req.body.semester || user.semester;
    user.nim = req.body.nim || user.nim;
    user.photo = req.body.photo || user.photo;
    user.bio = req.body.bio || req.body.description || user.bio;
    user.description = req.body.description || req.body.bio || user.description;
    user.instagram = req.body.instagram || user.instagram;
    user.linkedin = req.body.linkedin || user.linkedin;

    await user.save();

    await logActivity(user._id, "UPDATE_PROFILE", "User updated their profile details", req);

    res.json({
      message: "Profil berhasil diupdate",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh token wajib dikirim" });
    }

    const savedToken = await RefreshToken.findOne({ token }).populate("user");
    if (!savedToken || savedToken.expiresAt < new Date()) {
      if (savedToken) await RefreshToken.deleteOne({ token });
      return res.status(401).json({ message: "Refresh token tidak valid atau kedaluwarsa" });
    }

    if (savedToken.user.status === "suspended") {
      return res.status(403).json({ message: "User telah ditangguhkan" });
    }

    const newAccessToken = generateToken(savedToken.user._id);

    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
