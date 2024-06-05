const request = require("supertest");
const express = require("express");
const { ProductsRouter } = require("../Routes/productsRoutes");
const { productModel } = require("../Models/productModel");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../Controllers/userController");

const app = new express();
app.use("/", ProductsRouter);

jest.mock("../Controllers/userController", () => ({
  verifyToken: (_, __, next) => next(),
}));

describe("Product Routes", function () {
  test("responds to /", async () => {
    // mockear productModel
    const productMock = { _id: "1234" };
    const findSpy = jest
      .spyOn(productModel, "find")
      .mockResolvedValueOnce([productMock]);

    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch('{"data":[{"_id":"1234"}]}');
  });
});
