const request = require("supertest");
const express = require("express");
const { ProductsRouter } = require("../Routes/productsRoutes");
const { productModel } = require("../Models/productModel");
const { brandModel } = require("../Models/brandModel");

// jest.mock("../Models/productModel");
jest.mock("../Controllers/userController", () => ({
  verifyToken: (_, __, next) => next(),
  verifyAdminUsers: (_, __, next) => next(),
}));
describe("Product Routes", function () {
  // iniciar app express para pruebas
  const app = new express();
  app.use(express.json());
  app.use("/", ProductsRouter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("responds to /", async () => {
    // mockear productModel
    const productMock = { _id: "1234" };
    const findSpy = jest
      .spyOn(productModel, "find")
      .mockReturnValueOnce({ sort: () => [productMock] });

    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.text).toMatch('{"data":[{"_id":"1234"}]}');
    expect(res.statusCode).toBe(200);
  });

  test("responds to /brand", async () => {
    const brandMock = { name: "Example Brand" };
    const findSpy = jest
      .spyOn(brandModel, "find")
      .mockResolvedValueOnce([brandMock]);

    const res = await request(app).get("/brand");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch('{"data":[{"name":"Example Brand"}]}');
  });

  test.skip("adds a new product", async () => {
    // Mockear addProduct
    const productData = {
      name: "New Product",
      description: "This is a new product.",
      price: 99.99,
      product: "test",
      origin: "test",
      brand: "test",
      allergens: "test",
      ingredients: "test",
    };

    // Llamada a la ruta add product con los parámetros apropiados
    const res = await request(app)
      .post("/")
      .send(productData)
      .set("Content-Type", "application/json");

    const createSpy = jest
      .spyOn(productModel, "create")
      .mockResolvedValueOnce({ _id: "1234" });

    // Verificaciones
    expect(res.text).toMatch('{"data":[{"_id":"1234"}]}');
    expect(res.statusCode).toBe(200);
    expect(createSpy).toHaveBeenCalled();
  });
});
