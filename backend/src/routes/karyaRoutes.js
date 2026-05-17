const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  uploadKarya,
  getAllKarya,
  getDetailKarya,
  acceptKarya,
  deniedKarya,
} = require("../controllers/karyaController");

router.post("/", protect, upload.single("image"), uploadKarya);

router.get("/", getAllKarya);

router.get("/:id", getDetailKarya);
router.put("/accept/:id", protect, adminOnly, acceptKarya);

router.put("/denied/:id", protect, adminOnly, deniedKarya);

module.exports = router;
