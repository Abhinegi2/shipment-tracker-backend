const router = require("express").Router();
const Role = require("../models/Role");
const { auth, adminOnly } = require("../middleware/auth");

// Get all roles
router.get("/", auth, async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create role
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.create({ name, description, permissions });
    res.status(201).json(role);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Role name already exists" });
    res.status(500).json({ message: err.message });
  }
});

// Update role
router.patch("/:id", auth, adminOnly, async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystem) return res.status(403).json({ message: "Cannot modify system roles" });
    const { name, description, permissions } = req.body;
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;
    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete role
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystem) return res.status(403).json({ message: "Cannot delete system roles" });
    await role.deleteOne();
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
