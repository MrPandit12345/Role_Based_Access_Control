const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Role = require("../models/Role");
const { secret, tokenExpiresIn } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    if (!roleName) {
      return res.status(400).json({ message: "roleName is required" });
    }

    let role = await Role.findOne({ name: roleName });
    if (!role) {
      role = new Role({
        name: roleName,
        permissions:
          roleName === "Admin"
            ? ["create", "read", "update", "delete"]
            : ["read"],
      });
      await role.save();
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      role: role._id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email: user.email, role: role.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id, roleId: user.role._id };
    const token = jwt.sign(payload, secret, { expiresIn: tokenExpiresIn });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role._id,
          name: user.role.name,
          permissions: user.role.permissions,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
