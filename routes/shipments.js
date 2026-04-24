const router = require("express").Router();
const Shipment = require("../models/Shipment");
const { auth } = require("../middleware/auth");

// Get all shipments
router.get("/", auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) query.$or = [
      { trackingId: { $regex: search, $options: "i" } },
      { equipment: { $regex: search, $options: "i" } },
    ];
    const shipments = await Shipment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Shipment.countDocuments(query);
    res.json({ shipments, total });
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
    const { equipment, quantity, fromLocation, toLocation, notes } = req.body;
    const shipment = await Shipment.create({
      equipment, quantity, fromLocation, toLocation,
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
    const total = await Shipment.countDocuments();
    const byStatus = await Shipment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    res.json({ total, byStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
