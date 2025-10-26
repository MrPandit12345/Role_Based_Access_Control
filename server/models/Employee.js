const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    department: { type: String },
    role: { type: String },
    salary: { type: Number },
    status: { type: String, default: "active" },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
