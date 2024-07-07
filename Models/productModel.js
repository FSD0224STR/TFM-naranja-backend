const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: String,
    price: Number,
    origin: String,
    brand: String,
    allergens: Array,
    ingredients: Array,
    images: Array,
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);
const productModel = mongoose.model("Product", productSchema);

module.exports = {
  productModel,
};
