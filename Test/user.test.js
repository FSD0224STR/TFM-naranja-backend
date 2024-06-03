const request = require("supertest");
const app = require("../server.js");

describe("users test suite", () => {
  test("Jest is working", () => {
    const response = request(app).get("/users");
    response.expect(200);
  });
});
