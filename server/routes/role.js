const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const { authenticateJWT, authorize } = require("../middleware/auth");

router.get("/", authenticateJWT, authorize("roles", "read"), async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

router.post("/", async (req, res, next) => {
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      const { name, description, permissions } = req.body;
      const role = new Role({ name, description, permissions });
      await role.save();
      return res.status(201).json(role);
    }
    return authenticateAndCreate(req, res, next);
  } catch (err) {
    next(err);
  }
});

async function authenticateAndCreate(req, res, next) {
  const { authenticateJWT, authorize } = require("../middleware/auth");
  authenticateJWT(req, res, async () => {
    authorize("roles", "create")(req, res, async () => {
      try {
        const { name, description, permissions } = req.body;
        const role = new Role({ name, description, permissions });
        await role.save();
        res.status(201).json(role);
      } catch (err) {
        next(err);
      }
    });
  });
}

module.exports = router;
