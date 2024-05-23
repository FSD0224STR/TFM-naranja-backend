const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
  },
  { timestamps: true }
);
const brandModel = mongoose.model("Brand", brandSchema);

module.exports = {
  brandModel,
};
