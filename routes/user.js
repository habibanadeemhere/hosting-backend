const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/user/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/user/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { avatar, bio } = req.body;

    if (avatar && avatar.length > 3_000_000) {
      return res.status(400).json({ message: "Image is too large, please use a smaller one" });
    }

    const update = {};
    if (avatar !== undefined) update.avatar = avatar;
    if (bio !== undefined) update.bio = bio;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select(
      "-password"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
