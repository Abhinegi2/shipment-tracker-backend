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
    loginHeadline: { type: String, default: "Track Every Shipment\nReal-Time, Always" },
    loginSubtitle: { type: String, default: "Monitor equipment shipments across all locations with real-time status updates and full timeline tracking." },
    loginTags: { type: [String], default: ["Real-time Updates", "Timeline View", "Multi-location"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
