const mongoose = require("mongoose");
const { categoryModel } = require("../Models/categoryModel");

const findCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (categories.length === 0) {
      return res.status(404).json({ error: "Categories not found" });
    }
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findCategories,
};
