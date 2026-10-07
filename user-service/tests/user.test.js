const request = require("supertest");

const baseUrl = "http://localhost:3002";

describe("User Service", () => {
  test("GET /health should return service status", async () => {
    const response = await request(baseUrl).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
    expect(response.body.service).toBe("user-service");
  });

  test("GET /users should return users", async () => {
    const response = await request(baseUrl).get("/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("count");
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("GET /users/1 should return the user", async () => {
    const response = await request(baseUrl).get("/users/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(1);
  });
});
