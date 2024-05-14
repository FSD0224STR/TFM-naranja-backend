require("dotenv").config();

const { productModel } = require("../Models/productModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const tokenSecret = process.env.TOKEN_SECRET;

const findProduct = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }

  try {
    const product = await productModel.find({});
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }

  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }

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
    return res.status(400).json({ error: "You missed parameter" });
  }

  try {
    const newProduct = await productModel.create({
      ...req.body,
    });

    res.status(201).json({ data: "Product created", id: newProduct._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.findByIdAndUpdate(id, req.body);

    res.status(200).json({ data: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ data: "Product removed successfully" });
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
