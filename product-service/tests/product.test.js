const request = require("supertest");

const baseUrl = "http://localhost:3001";

describe("Product Service", () => {
  test("GET /health should return service status", async () => {
    const response = await request(baseUrl).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
    expect(response.body.service).toBe("product-service");
  });

  test("GET /products should return products", async () => {
    const response = await request(baseUrl).get("/products");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("count");
    expect(response.body).toHaveProperty("products");
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test("GET /products/1 should return the product", async () => {
    const response = await request(baseUrl).get("/products/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(1);
  });
});
