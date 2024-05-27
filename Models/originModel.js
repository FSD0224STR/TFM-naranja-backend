const mongoose = require("mongoose");

const originSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
  },
  { timestamps: true }
);
const originModel = mongoose.model("Origin", originSchema);

module.exports = {
  originModel,
};
