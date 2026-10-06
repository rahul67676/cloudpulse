const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "cloudpulse",
  password: process.env.DB_PASSWORD || "cloudpulse_password",
  database: process.env.DB_NAME || "cloudpulse",
  port: process.env.DB_PORT || 3306
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "UP",
      service: "product-service",
      database: "CONNECTED"
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      service: "product-service",
      database: "DISCONNECTED"
    });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT id, name, category, price, stock FROM products"
    );

    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT id, name, category, price, stock FROM products WHERE id = ?",
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(products[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch product"
    });
  }
});

// Add product
app.post("/products", async (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      error: "name, category, price and stock are required"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)",
      [name, category, price, stock]
    );

    const [products] = await db.query(
      "SELECT id, name, category, price, stock FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: products[0]
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create product"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Product Service running on port ${PORT}`);
});
