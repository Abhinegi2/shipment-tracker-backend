const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const userPayload = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, location: u.location, avatar: u.avatar });

// Email/password login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid email or password" });
    if (user.status === "inactive")
      return res.status(403).json({ message: "Account is inactive" });
    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google SSO
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar: picture, role: "location_user" });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
    }
    if (user.status === "inactive")
      return res.status(403).json({ message: "Account is inactive" });

    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed" });
  }
});

// Get current user
router.get("/me", auth, (req, res) => {
  res.json({ user: userPayload(req.user) });
});

// Seed admin
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
