const mongoose = require("mongoose");

// Singleton document — always one row with key "app"
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "app", unique: true },
    appName: { type: String, default: "Shipment Tracker" },
    appSubtitle: { type: String, default: "Tracking" },
    logoEmoji: { type: String, default: "🚚" },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#2563EB" },
    sidebarColor: { type: String, default: "#0F172A" },
    accentColor: { type: String, default: "#1E3A5F" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
