const mongoose = require("mongoose");

const ingredientsSchema = new mongoose.Schema(
  {
    title: String,
    value: String,
  },
  { timestamps: true }
);
const ingredientsModel = mongoose.model("Ingredient", ingredientsSchema);

module.exports = {
  ingredientsModel,
};
