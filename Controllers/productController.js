const { productModel } = require("../Models/productModel");
const { allergensModel } = require("../Models/allergensModel");
const { ingredientsModel } = require("../Models/ingredientsModel");
const { originModel } = require("../Models/originModel");
const mongoose = require("mongoose");
const { brandModel } = require("../Models/brandModel");
const { categoryModel } = require("../Models/categoryModel");
const slugify = require("slugify");

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
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const sanitizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const searchCriteria = { slug: { $regex: new RegExp(sanitizedQuery, 'i') } };

    const products = await productModel.find(searchCriteria);

    const suggestions = products.map((product) => ({
      name: product.product,
      category: product.category,
    }));

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
};


const findProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    console.log("Search term received:", searchTerm);

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const sanitizedTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-');
    console.log("Sanitized term (slug):", sanitizedTerm);

    const products = await productModel.find({ slug: sanitizedTerm });
    console.log("Products found:", products);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: `No se encontraron productos para "${searchTerm}"` });
    }

    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
};






const findProductById = async (req, res) => {
  const { slug } = req.params;

  try {
    // Con el metodo lean() devolvemos un objeto plano
    const product = await productModel.findOne({ slug: slug }).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const category = await categoryModel.findById(product.category).lean();
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    product.category = category.category;
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  const {
    product,
    description,
    price,
    category,
    origin,
    brand,
    allergens,
    ingredients,
    images,
    user,
  } = req.body;

  if (
    !product ||
    !description ||
    !price ||
    !category ||
    !origin ||
    !brand ||
    !allergens ||
    !ingredients ||
    !images ||
    !user
  ) {
    return res.status(400).json({ error: "You missed parameter" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const slug = slugify(product, {
      lower: true,
      strict: true,
      replacement: "-",
      trim: true,
    });

    const newProduct = await productModel.create({
      product,
      description,
      price,
      category: new mongoose.Types.ObjectId(category),
      origin,
      brand,
      allergens,
      ingredients,
      images,
      slug,
      user: new mongoose.Types.ObjectId(user),
    });

    res.status(201).json({ data: "Product created", id: newProduct._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { slug } = req.params;
  let product;

  try {
    product = await productModel.findOne({ slug: slug }).lean();
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  req.body.category = product.category;

  try {
    await productModel.findOneAndUpdate({ slug: slug }, req.body);

    res.status(200).json({ data: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await productModel.findOne({ slug: slug });
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    await productModel.findOneAndDelete({ slug: slug });
    res.status(200).json({ data: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const categoryName = await categoryModel
      .findOne({ category: category })
      .lean();
    if (!categoryName) {
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await productModel
      .find({
        category: categoryName._id,
      })
      .populate("category")
      .sort({ createAt: -1 })
      .lean();

    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const getFilterProducts = async (req, res) => {
  try {
    const { product, category, minPrice, maxPrice } = req.query;

    let query = {};

    if (product) {
      const slug = slugify(product, {
        lower: true,
        strict: true,
        replacement: "-",
        trim: true,
      });
      const regex = new RegExp(`\\b${slug}\\b`, "i");
      query.slug = regex;
    }

    if (category) {
      const isObjectId =
        mongoose.Types.ObjectId.isValid(category) &&
        new mongoose.Types.ObjectId(category).toString() === category;

      if (isObjectId) {
        query.category = category;
      } else {
        try {
          const categoryName = await categoryModel.findOne({
            category: category,
          });
          if (categoryName) {
            query.category = categoryName._id;
          } else {
            return res.status(404).json({ message: "Category not found" });
          }
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await productModel.find(query);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  getSuggestions,
  getFilterProducts,
};
