const express = require("express");

const {
  findProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findProductById,
  findProductsByCategory,
} = require("../Controllers/productController");

const { verifyToken } = require("../Controllers/userController");

const ProductsRouter = express.Router();

ProductsRouter.use(verifyToken);

ProductsRouter.get("/category/:category", findProductsByCategory);

ProductsRouter.get("/", findProduct);
ProductsRouter.post("/", addProduct);
ProductsRouter.put("/:id", updateProduct);
ProductsRouter.delete("/:id", deleteProduct);
ProductsRouter.get("/:id", findProductById);

module.exports = {
  ProductsRouter,
};
