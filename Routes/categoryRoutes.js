const express = require("express");
const { findCategories } = require("../Controllers/categoryController");

// const { getUser, loginUser } = require("../Controllers/userController");
const CategoriesRouter = express.Router();

CategoriesRouter.get("/categories", findCategories);
CategoriesRouter.post("/categories");
CategoriesRouter.put("/categories/:id");
CategoriesRouter.delete("/categories/:id");
CategoriesRouter.get("/categories/:id");

module.exports = {
  CategoriesRouter,
};
