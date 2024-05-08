const { productModel } = require("../Models/productModel");
const mongoose = require("mongoose");

const findProduct = async (req, res) => {
  try {
    const product = await productModel.find({ status: { $ne: "DONE" } });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  const { product, description, price, origin, brand, allergens, ingredients } =
    req.body;

  if (
    !product ||
    !description ||
    !price ||
    !origin ||
    !brand ||
    !allergens ||
    !ingredients
  ) {
    return res.status(400).json({ msg: "You missed parameter 'title'" });
  }

  try {
    const newProduct = await productModel.create({
      ...req.body,
    });
    res.status(201).json({ msg: "Product created", id: newProduct._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await Product.findByIdAndUpdate(id, req.body);

    res.status(200).json({ msg: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findProduct,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
