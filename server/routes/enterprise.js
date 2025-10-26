const express = require("express");
const router = express.Router();
const Enterprise = require("../models/Enterprise");
const { authenticateJWT } = require("../middleware/auth");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const enterprises = await Enterprise.find();
    res.json(enterprises);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", authenticateJWT, async (req, res) => {
  try {
    const enterprise = new Enterprise(req.body);
    await enterprise.save();
    res.status(201).json(enterprise);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Enterprise.findByIdAndDelete(req.params.id);
    res.json({ message: "Enterprise deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
