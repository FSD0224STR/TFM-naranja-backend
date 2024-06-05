const ProductController = require("../Controllers/productController");
const { productModel } = require("../Models/productModel");

describe("Product Controller", () => {
  const productMock = { _id: "1234" };

  // mockeado el req/res de express
  const req = {};
  const res = {};
  res.json = jest.fn();
  res.status = jest.fn(() => res);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("findProduct returns product list", async () => {
    // mock de productModel para que find devuelva un array de productos mock
    const findSpy = jest
      .spyOn(productModel, "find")
      .mockResolvedValueOnce([productMock]);

    await expect(
      ProductController.findProduct(req, res)
    ).resolves.not.toThrow();
    expect(findSpy).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [productMock] });
  });

  it("findProduct returns 404 when no products are found", async () => {
    const findSpy = jest.spyOn(productModel, "find").mockResolvedValueOnce([]);

    await expect(
      ProductController.findProduct(req, res)
    ).resolves.not.toThrow();
    expect(findSpy).toHaveBeenCalledWith({});
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
    expect(findSpy).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "test error" });
  });
});
