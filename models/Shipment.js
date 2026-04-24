const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    location: { type: String, required: true },
    notes: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String },
  },
  { timestamps: true }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true },
    equipment: { type: String, required: true },
    itemDescription: { type: String, default: "" },
    category: { type: String, default: "General" },
    weight: { type: Number, default: null },
    quantity: { type: Number, required: true },
    fromLocation: { type: String, required: true },
    fromState: { type: String, default: "" },
    fromDistrict: { type: String, default: "" },
    toLocation: { type: String, required: true },
    toState: { type: String, default: "" },
    toDistrict: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Created", "Dispatched", "In Transit", "Reached", "Out for Delivery", "Delivered"],
      default: "Created",
    },
    timeline: [timelineSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
  },
  { timestamps: true }
);

shipmentSchema.pre("save", async function (next) {
  if (!this.trackingId) {
    const count = await mongoose.model("Shipment").countDocuments();
    this.trackingId = `TRK${String(10001 + count).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
