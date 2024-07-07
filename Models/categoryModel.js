const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      required: true,
    },
    properties: Array,
    image: String,
  },
  { timestamps: true }
);
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
  categoryModel,
};
