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

//ProductsRouter.use(verifyToken);

ProductsRouter.get("/category/:category", verifyToken, findProductsByCategory);

ProductsRouter.get("/", verifyToken, findProduct);
ProductsRouter.post("/", verifyToken, addProduct);
ProductsRouter.put("/:id", verifyToken, updateProduct);
ProductsRouter.delete("/:id", verifyToken, deleteProduct);
ProductsRouter.get("/:id", verifyToken, findProductById);

module.exports = {
  ProductsRouter,
};
