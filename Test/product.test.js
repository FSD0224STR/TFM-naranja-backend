const request = require("supertest");
const app = require("../server.js");
const ProductsRouter = express.Router();

import request from "supertest";
import express from "express";

describe("ProductsRouter tests", () => {
  let app;

  beforeEach(() => {
    const expressApp = express();
    expressApp.use(express.json());
    expressApp.use("/", ProductsRouter);
    app = expressApp;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return all products when available", async () => {
    const mockProducts = [{ _id: "1", name: "Product 1" }];
    ProductsRouter.get.mockImplementation((req, res) => {
      res.status(200).json({ data: mockProducts });
    });

    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(mockProducts);
  });

  it("should return 404 when there are no products", async () => {
    ProductsRouter.get.mockImplementation((req, res) => {
      res.status(404).json({ error: "Products not found" });
    });

    const response = await request(app).get("/");
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toEqual("Products not found");
  });

  it("should return 500 on error", async () => {
    const errorMessage = "Database error";
    ProductsRouter.get.mockImplementation((req, res) => {
      throw new Error(errorMessage);
    });

    const response = await request(app).get("/");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toEqual(errorMessage);
  });
});

import request from "supertest";
import express from "express";
import { ProductsRouter } from "../path/to/your/router"; // Ajusta la ruta según corresponda

describe("ProductsRouter POST tests", () => {
  let app;

  beforeEach(() => {
    const expressApp = express();
    expressApp.use(express.json()); // Asegúrate de que tu aplicación Express use express.json()
    expressApp.use("/", ProductsRouter); // Usa el router en tu aplicación Express
    app = expressApp;
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reinicia los mocks después de cada prueba
  });

  it("should create a new product successfully", async () => {
    const mockProductData = {
      product: "Mock Product",
      description: "This is a mock product.",
      price: 100,
      origin: "Mock Origin",
      brand: "Mock Brand",
      allergens: ["Mock Allergen"],
      ingredients: ["Mock Ingredient"],
    };

    productModel.create.mockResolvedValue({
      ...mockProductData,
      _id: "123456789",
    });

    const response = await request(app).post("/").send(mockProductData);

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toEqual("Product created");
    expect(response.body.id).toEqual("123456789");
  });

  it("should return 400 if required parameters are missing", async () => {
    const response = await request(app).post("/").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual("You missed parameter");
  });

  it("should return 500 on database error", async () => {
    const errorMessage = "Database error";
    productModel.create.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .post("/")
      .send({
        product: "Mock Product",
        description: "This is a mock product.",
        price: 100,
        origin: "Mock Origin",
        brand: "Mock Brand",
        allergens: ["Mock Allergen"],
        ingredients: ["Mock Ingredient"],
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toEqual(errorMessage);
  });
});
