const mongoose = require("mongoose");

const EnterpriseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enterprise", EnterpriseSchema);
