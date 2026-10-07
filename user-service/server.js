const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

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
      service: "user-service",
      database: "CONNECTED"
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      service: "user-service",
      database: "DISCONNECTED"
    });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM users"
    );

    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users"
    });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch user"
    });
  }
});

// Create user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "name and email are required"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "User created successfully",
      user: users[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "Failed to create user"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`User Service running on port ${PORT}`);
});
