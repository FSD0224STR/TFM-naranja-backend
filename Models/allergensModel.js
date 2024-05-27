const mongoose = require("mongoose");

const allergensSchema = new mongoose.Schema(
  {
    title: String,
    value: String,
  },
  { timestamps: true }
);
const allergensModel = mongoose.model("Allergens", allergensSchema);

module.exports = {
  allergensModel,
};
