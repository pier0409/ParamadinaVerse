const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const adminEmails = [
  "prila.rizqi@students.paramadina.ac.id",
  "fadhil.husein@students.paramadina.ac.id",
  "najjuan.fariz@students.paramadina.ac.id",
];

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    let role = "mahasiswa";

    if (adminEmails.includes(email)) {
      role = "admin";
    }

    let finalPassword = password;

    if (role === "admin") {
      finalPassword = process.env.ADMIN_PASSWORD;
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
