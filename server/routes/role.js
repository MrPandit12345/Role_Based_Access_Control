const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const { authenticateJWT, authorize } = require("../middleware/auth");


router.get("/", authenticateJWT, authorize("roles", "read"), async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    next(err);
  }
});


router.post("/", authenticateJWT, authorize("roles", "create"), async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    const role = new Role({ name, description, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
});


router.delete("/:id", authenticateJWT, authorize("roles", "delete"), async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
