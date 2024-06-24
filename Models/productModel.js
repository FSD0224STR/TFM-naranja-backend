const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product: String,
    category: { type: mongoose.Schema.Types.String, ref: "Category" },
    description: String,
    price: Number,
    origin: String,
    brand: String,
    allergens: Array,
    ingredients: Array,
    images: Array,
  },
  { timestamps: true }
);
const productModel = mongoose.model("Product", productSchema);

module.exports = {
  productModel,
};
