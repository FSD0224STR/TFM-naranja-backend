const { faker } = require("@faker-js/faker");
const ProductController = require("../Controllers/productController");
const { productModel } = require("../Models/productModel");

describe("Product Controller", () => {
  const productId = faker.database.mongodbObjectId();
  const productMock = { _id: productId };

  // mockeado el req/res de express
  const req = {
    params: { ids: [productId] },
  };
  const res = {};
  res.json = jest.fn();
  res.status = jest.fn(() => res);

  it("findProduct returns product list", async () => {
    // mock de productModel para que find devuelva un array de productos mock
    const findSpy = jest
      .spyOn(productModel, "find")
      .mockResolvedValueOnce([productMock]);

    await expect(
      ProductController.findProduct(req, res)
    ).resolves.not.toThrow();
    expect(findSpy).toHaveBeenCalledWith({
      _id: { $in: expect.anything() },
    });
    expect(res.json).toHaveBeenCalledWith({ data: [productMock] });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("findProduct returns 404 when no products are found", async () => {
    const findSpy = jest.spyOn(productModel, "find").mockResolvedValueOnce([]);

    await expect(
      ProductController.findProduct(req, res)
    ).resolves.not.toThrow();
    expect(findSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Products not found" });
  });

  it("findProduct returns 500 when database connection fails", async () => {
    const findSpy = jest
      .spyOn(productModel, "find")
      .mockRejectedValueOnce({ message: "test error" });

    await expect(
      ProductController.findProduct(req, res)
    ).resolves.not.toThrow();
    expect(findSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "test error" });
  });
});

describe("Product Controller - Find Product By ID", () => {
  const productId = "1234";
  const productMock = { _id: productId, name: "Test Product" };
  const errorMessage = "Product not found";

  // Mockeado el req/res de express
  const req = { params: { id: productId } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("finds a product by ID and returns it", async () => {
    // Mock de productModel para que findById devuelva el producto simulado
    const findByIdSpy = jest
      .spyOn(productModel, "findById")
      .mockResolvedValueOnce(productMock);

    await expect(
      ProductController.findProductById(req, res)
    ).resolves.not.toThrow();

    expect(findByIdSpy).toHaveBeenCalledWith(productId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: productMock });
  });

  it("returns 404 when product is not found", async () => {
    // Mock de productModel para que findById devuelva un array vacío
    const findByIdSpy = jest
      .spyOn(productModel, "findById")
      .mockResolvedValueOnce([]);

    await expect(
      ProductController.findProductById(req, res)
    ).resolves.not.toThrow();

    expect(findByIdSpy).toHaveBeenCalledWith(productId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });

  it("returns 500 when there is a database error", async () => {
    // Mock de productModel para que findById rechace con un error
    const findByIdSpy = jest
      .spyOn(productModel, "findById")
      .mockRejectedValueOnce(new Error("Database error"));

    await expect(
      ProductController.findProductById(req, res)
    ).resolves.not.toThrow();

    expect(findByIdSpy).toHaveBeenCalledWith(productId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
