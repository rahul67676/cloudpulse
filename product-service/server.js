const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

const products = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    category: "Electronics",
    price: 129999,
    stock: 15
  },
  {
    id: 2,
    name: "MacBook Air",
    category: "Electronics",
    price: 99999,
    stock: 10
  },
  {
    id: 3,
    name: "Sony Headphones",
    category: "Electronics",
    price: 12999,
    stock: 25
  },
  {
    id: 4,
    name: "Nike Running Shoes",
    category: "Fashion",
    price: 7999,
    stock: 20
  }
];

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "product-service"
  });
});

// Get all products
app.get("/products", (req, res) => {
  res.json({
    count: products.length,
    products: products
  });
});

// Get product by ID
app.get("/products/:id", (req, res) => {

  const product = products.find(
    item => item.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  res.json(product);
});

// Add product
app.post("/products", (req, res) => {

  const { name, category, price, stock } = req.body;

  if (!name || !category || !price || stock === undefined) {
    return res.status(400).json({
      error: "name, category, price and stock are required"
    });
  }

  const product = {
    id: products.length + 1,
    name,
    category,
    price,
    stock
  };

  products.push(product);

  res.status(201).json({
    message: "Product created successfully",
    product
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Product Service running on port ${PORT}`);
});
