const express = require("express");

// const { getUser, loginUser } = require("../Controllers/userController");
const CategoriesRouter = express.Router();

CategoriesRouter.get("/categories");
CategoriesRouter.post("/categories");
CategoriesRouter.put("/categories/:id");
CategoriesRouter.delete("/categories/:id");
CategoriesRouter.get("/categories/:id");

module.exports = {
  CategoriesRouter,
};
