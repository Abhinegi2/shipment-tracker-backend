const router = require("express").Router();
const User = require("../models/User");
const { auth, adminOnly } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });
    const user = await User.create({ name, email, password, role, location });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, location: user.location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user status
router.patch("/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
