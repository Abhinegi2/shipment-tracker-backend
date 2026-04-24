const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid email or password" });
    if (user.status === "inactive")
      return res.status(403).json({ message: "Account is inactive" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get("/me", auth, (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, location: req.user.location } });
});

// Seed admin (run once)
router.post("/seed", async (req, res) => {
  try {
    const exists = await User.findOne({ email: "admin@shiptrack.com" });
    if (exists) return res.json({ message: "Admin already exists" });
    await User.create({ name: "Admin User", email: "admin@shiptrack.com", password: "admin123", role: "admin", location: "Head Office" });
    res.json({ message: "Admin created: admin@shiptrack.com / admin123" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
