const express = require("express");

// const { getUser, loginUser } = require("../Controllers/userController");
const ProductsRouter = express.Router();

ProductsRouter.get("/products");
ProductsRouter.post("/products");
ProductsRouter.put("/products/:id");
ProductsRouter.delete("/products/:id");
ProductsRouter.get("/products/:id");

module.exports = {
  ProductsRouter,
};
