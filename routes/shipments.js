const router = require("express").Router();
const Shipment = require("../models/Shipment");
const { auth } = require("../middleware/auth");

// Public tracking — no auth required
router.get("/public/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.id.toUpperCase() })
      .select("trackingId equipment category quantity weight fromLocation toLocation status timeline estimatedDelivery createdAt itemDescription");
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all shipments
router.get("/", auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) query.$or = [
      { trackingId: { $regex: search, $options: "i" } },
      { equipment: { $regex: search, $options: "i" } },
      { fromLocation: { $regex: search, $options: "i" } },
      { toLocation: { $regex: search, $options: "i" } },
    ];
    const [shipments, total] = await Promise.all([
      Shipment.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      Shipment.countDocuments(query),
    ]);
    res.json({ shipments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single shipment
router.get("/:id", auth, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.id });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create shipment
router.post("/", auth, async (req, res) => {
  try {
    const {
      equipment, itemDescription, category, weight, quantity,
      fromLocation, fromState, fromDistrict,
      toLocation, toState, toDistrict,
      senderName, senderPhone, recipientName, recipientPhone,
      estimatedDelivery, notes,
    } = req.body;
    const shipment = await Shipment.create({
      equipment, itemDescription, category, weight, quantity,
      fromLocation, fromState, fromDistrict,
      toLocation, toState, toDistrict,
      senderName, senderPhone, recipientName, recipientPhone,
      estimatedDelivery: estimatedDelivery || null,
      createdBy: req.user._id,
      createdByName: req.user.name,
      timeline: [{
        status: "Created",
        location: fromLocation,
        notes: notes || "Shipment has been created.",
        updatedBy: req.user._id,
        updatedByName: req.user.name,
      }],
    });
    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update shipment status
router.post("/:id/update-status", auth, async (req, res) => {
  try {
    const { status, location, notes } = req.body;
    const shipment = await Shipment.findOne({ trackingId: req.params.id });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    shipment.status = status;
    shipment.timeline.unshift({
      status, location,
      notes: notes || `Status updated to ${status}.`,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
    });
    await shipment.save();
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats
router.get("/stats/summary", auth, async (req, res) => {
  try {
    const [total, byStatus] = await Promise.all([
      Shipment.countDocuments(),
      Shipment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    res.json({ total, byStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
