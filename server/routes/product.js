const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Enterprise = require("../models/Enterprise");
const Employee = require("../models/Employee");
const { authenticateJWT } = require("../middleware/auth");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("enterpriseId")
      .populate("assignedEmployeeId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", authenticateJWT, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
