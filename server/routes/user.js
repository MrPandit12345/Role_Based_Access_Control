const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const { authenticateJWT, authorize } = require("../middleware/auth");

router.get("/", authenticateJWT, authorize("users", "read"), async (req, res) => {
  const users = await User.find().populate("role", "name permissions");
  res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));
});

router.post("/", authenticateJWT, authorize("users", "create"), async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    if (!email || !password || !roleName) return res.status(400).json({ message: "name,email,password,roleName required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ message: "Role not found" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, role: role._id });
    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
