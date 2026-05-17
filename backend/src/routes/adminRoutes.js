const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  updateUserRole,
  deleteUser,

  getAllKaryaAdmin,
  reviewKarya,
  acceptKaryaAdmin,
  deniedKaryaAdmin,
  deleteKaryaAdmin,
} = require("../controllers/adminController");

/* =========================================
   USER MANAGEMENT
========================================= */

router.get("/users", protect, adminOnly, getAllUsers);

router.put("/users/:id", protect, adminOnly, updateUserRole);

router.delete("/users/:id", protect, adminOnly, deleteUser);

/* =========================================
   KARYA MANAGEMENT
========================================= */

router.get("/karya", protect, adminOnly, getAllKaryaAdmin);

router.get("/karya/:id", protect, adminOnly, reviewKarya);

router.put("/karya/accept/:id", protect, adminOnly, acceptKaryaAdmin);

router.put("/karya/denied/:id", protect, adminOnly, deniedKaryaAdmin);

router.delete("/karya/:id", protect, adminOnly, deleteKaryaAdmin);

module.exports = router;
