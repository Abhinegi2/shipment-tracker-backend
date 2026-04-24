const router = require("express").Router();
const Settings = require("../models/Settings");
const { auth, adminOnly } = require("../middleware/auth");

const getOrCreate = () => Settings.findOneAndUpdate(
  { key: "app" },
  { $setOnInsert: { key: "app" } },
  { upsert: true, new: true }
);

// Get settings (public — needed to render app branding)
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update settings (admin only)
router.patch("/", auth, adminOnly, async (req, res) => {
  try {
    const allowed = ["appName", "appSubtitle", "logoEmoji", "logoUrl", "primaryColor", "sidebarColor", "accentColor"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const settings = await Settings.findOneAndUpdate({ key: "app" }, updates, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
