const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: String,
    properties: Array,
  },
  { timestamps: true }
);
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
  categoryModel,
};
