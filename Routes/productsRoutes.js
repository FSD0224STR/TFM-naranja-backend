const express = require("express");

const {
  findProducts,
  findAllProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findProductById,
  findProductsByCategory,
  findOrigin,
  findAllergens,
  findIngredients,
  findBrand,
  getSuggestions,
  getFilterProducts,
} = require("../Controllers/productController");

const {
  verifyToken,
  verifyAdminUsers,
} = require("../Controllers/userController");

const ProductsRouter = express.Router();

ProductsRouter.use(verifyToken);

ProductsRouter.get("/category/:category", findProductsByCategory);

ProductsRouter.get("/brand", findBrand);
ProductsRouter.get("/origin", findOrigin);
ProductsRouter.get("/allergens", findAllergens);
ProductsRouter.get("/ingredients", findIngredients);
ProductsRouter.get("/filters", getFilterProducts);
ProductsRouter.get("/", findAllProduct);
ProductsRouter.get("/search", findProducts);
ProductsRouter.get("/suggestions", getSuggestions);
ProductsRouter.post("/", addProduct);
ProductsRouter.put("/:slug", verifyAdminUsers, updateProduct);
ProductsRouter.delete("/:slug", verifyAdminUsers, deleteProduct);
ProductsRouter.get("/:slug", findProductById);

module.exports = {
  ProductsRouter,
};
