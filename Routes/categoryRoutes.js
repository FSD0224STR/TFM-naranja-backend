const express = require("express");
const { findCategories } = require("../Controllers/categoryController");

const CategoriesRouter = express.Router();

CategoriesRouter.get("/", findCategories);
CategoriesRouter.post("/");
CategoriesRouter.put("/:id");
CategoriesRouter.delete("/:id");
CategoriesRouter.get("/:id");

module.exports = {
  CategoriesRouter,
};
