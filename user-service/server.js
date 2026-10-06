const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;

const users = [
  {
    id: 1,
    name: "Rahul Reddy",
    email: "rahul@example.com"
  },
  {
    id: 2,
    name: "CloudPulse User",
    email: "user@example.com"
  }
];

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "user-service"
  });
});

// Get all users
app.get("/users", (req, res) => {
  res.json({
    count: users.length,
    users: users
  });
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(
    item => item.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  res.json(user);
});

// Create user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "name and email are required"
    });
  }

  const user = {
    id: users.length + 1,
    name,
    email
  };

  users.push(user);

  res.status(201).json({
    message: "User created successfully",
    user
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`User Service running on port ${PORT}`);
});
