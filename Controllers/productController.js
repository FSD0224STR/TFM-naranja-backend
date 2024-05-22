require("dotenv").config();

const { productModel } = require("../Models/productModel");
const { allergensModel } = require("../Models/allergensModel");
const { ingredientsModel } = require("../Models/ingredientsModel");
const { originModel } = require("../Models/originModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const tokenSecret = process.env.TOKEN_SECRET;

const findProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ data: product });
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await productModel.findById(id);
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    await productModel.findByIdAndUpdate(id, req.body);

    res.status(200).json({ data: "Product updated" });
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
    if (product.length === 0) {
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

const findProductsByCategory = async (req, res) => {
  try {
    const targetCategory = req.params.category;

    const result = (await productModel.populate("Category")).find({
      category: { category: targetCategory },
    });
    res.json(result);
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Token verification failed: " + error.message });
  }
};

const findOrigin = async (req, res) => {
  try {
    const origin = await originModel.find({});

    if (origin.length === 0) {
      return res.status(404).json({ error: "Origin product not found" });
    }
    res.status(200).json({ data: origin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findAllergens = async (req, res) => {
  try {
    const allergens = await allergensModel.find({});

    if (allergens.length === 0) {
      return res.status(404).json({ error: "Allergens not found" });
    }
    res.status(200).json({ data: allergens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findIngredients = async (req, res) => {
  try {
    const ingredients = await ingredientsModel.find({});

    if (ingredients.length === 0) {
      return res.status(404).json({ error: "Ingredients not found" });
    }
    res.status(200).json({ data: ingredients });

const findProducts = async (req, res) => {
  validateToken(req, res);

  const { ids } = req.params;
  try {
    const products = await productModel
      .find({
        _id: { $in: ids.map((id) => new mongoose.ObjectId(id)) },
      })
      .toArray();
    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ data: products });
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
  findProductsByCategory,
  findOrigin,
  findAllergens,
  findIngredients,
  findProducts,
};
