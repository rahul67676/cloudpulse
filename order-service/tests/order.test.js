const request = require("supertest");

const baseUrl = "http://localhost:3003";

describe("Order Service", () => {
  test("GET /health should return service status", async () => {
    const response = await request(baseUrl).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
    expect(response.body.service).toBe("order-service");
  });

  test("GET /orders should return orders", async () => {
    const response = await request(baseUrl).get("/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("count");
    expect(response.body).toHaveProperty("orders");
    expect(Array.isArray(response.body.orders)).toBe(true);
  });

  test("GET /orders/1 should return the order", async () => {
    const response = await request(baseUrl).get("/orders/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(1);
  });
});
