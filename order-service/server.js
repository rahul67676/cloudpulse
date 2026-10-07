const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3003;

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
      service: "order-service",
      database: "CONNECTED"
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      service: "order-service",
      database: "DISCONNECTED"
    });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT id, user_id, product_id, quantity, total_amount, status FROM orders"
    );

    res.json({
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch orders"
    });
  }
});

// Get order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT id, user_id, product_id, quantity, total_amount, status FROM orders WHERE id = ?",
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch order"
    });
  }
});

// Create order
app.post("/orders", async (req, res) => {
  const { userId, productId, quantity, totalAmount } = req.body;

  if (!userId || !productId || !quantity || totalAmount === undefined) {
    return res.status(400).json({
      error: "userId, productId, quantity and totalAmount are required"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO orders (user_id, product_id, quantity, total_amount, status) VALUES (?, ?, ?, ?, ?)",
      [userId, productId, quantity, totalAmount, "PLACED"]
    );

    const [orders] = await db.query(
      "SELECT id, user_id, product_id, quantity, total_amount, status FROM orders WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Order created successfully",
      order: orders[0]
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create order"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Order Service running on port ${PORT}`);
});
