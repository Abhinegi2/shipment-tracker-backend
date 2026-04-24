const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    permissions: {
      type: [String],
      enum: ["dashboard", "shipments", "create_shipment", "users", "reports", "roles", "settings"],
      default: ["dashboard"],
    },
    isSystem: { type: Boolean, default: false }, // admin/default roles can't be deleted
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
