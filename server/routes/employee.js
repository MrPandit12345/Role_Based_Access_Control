const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Enterprise = require("../models/Enterprise");
const { authenticateJWT } = require("../middleware/auth");


router.get("/", authenticateJWT, async (req, res) => {
  try {
    const employees = await Employee.find().populate("enterpriseId");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", authenticateJWT, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
