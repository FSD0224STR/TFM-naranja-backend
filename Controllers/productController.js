const { productModel } = require("../Models/productModel");
const { allergensModel } = require("../Models/allergensModel");
const { ingredientsModel } = require("../Models/ingredientsModel");
const { originModel } = require("../Models/originModel");
const mongoose = require("mongoose");
const { brandModel } = require("../Models/brandModel");

const findAllProduct = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });
    if (products.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { query, category } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const sanitizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const regex = new RegExp(`\\b${sanitizedQuery}\\b`, "i");

    const searchCriteria = category ? 
      { $and: [{ category: { $regex: new RegExp(`^${category}$`, 'i') } }, { product: { $regex: regex } }] } :
      { product: { $regex: regex } };

    const products = await productModel.find(searchCriteria);

    const suggestions = products.map(product => ({
      name: product.product,
      category: product.category,
    }));

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Error fetching suggestions' });
  }
};



const findProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const sanitizedTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const regex = new RegExp(`\\b${sanitizedTerm}\\b`, "i");

    const products = await productModel.find({
      $or: [
        { product: { $regex: regex } },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ error: `No se encontraron productos para "${searchTerm}"` });
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

    const result = (await productModel.populate("Category"))
      .find({
        category: { category: targetCategory },
      })
      .sort({ createdAt: -1 });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProduct = async (req, res) => {
  const { ids } = req.params;
  try {
    const products = await productModel.find({
      _id: { $in: ids.map((id) => new mongoose.ObjectId(id)) },
    });
    if (!products.length) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findBrand = async (req, res) => {
  try {
    const brand = await brandModel.find({});

    if (brand.length === 0) {
      return res.status(404).json({ error: "Brand product not found" });
    }
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findAllProduct,
  findProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  findProductsByCategory,
  findOrigin,
  findAllergens,
  findIngredients,
  findProduct,
  findBrand,
  getSuggestions
};
