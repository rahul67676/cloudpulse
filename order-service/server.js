const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3003;

const orders = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 1,
    totalAmount: 129999,
    status: "PLACED"
  },
  {
    id: 2,
    userId: 2,
    productId: 3,
    quantity: 2,
    totalAmount: 25998,
    status: "SHIPPED"
  }
];

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "order-service"
  });
});

// Get all orders
app.get("/orders", (req, res) => {
  res.json({
    count: orders.length,
    orders: orders
  });
});

// Get order by ID
app.get("/orders/:id", (req, res) => {
  const order = orders.find(
    item => item.id === Number(req.params.id)
  );

  if (!order) {
    return res.status(404).json({
      error: "Order not found"
    });
  }

  res.json(order);
});

// Create order
app.post("/orders", (req, res) => {
  const { userId, productId, quantity, totalAmount } = req.body;

  if (!userId || !productId || !quantity || !totalAmount) {
    return res.status(400).json({
      error: "userId, productId, quantity and totalAmount are required"
    });
  }

  const order = {
    id: orders.length + 1,
    userId,
    productId,
    quantity,
    totalAmount,
    status: "PLACED"
  };

  orders.push(order);

  res.status(201).json({
    message: "Order created successfully",
    order
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Order Service running on port ${PORT}`);
});
