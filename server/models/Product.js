const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    category: { type: String },
    status: { type: String, default: "active" },
    enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" },
    assignedEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
