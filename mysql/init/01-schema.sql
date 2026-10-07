CREATE DATABASE IF NOT EXISTS cloudpulse;

USE cloudpulse;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLACED'
);

INSERT INTO products (id, name, category, price, stock)
VALUES (1, 'iPhone 17 Pro', 'Electronics', 129999.00, 15)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    category = VALUES(category),
    price = VALUES(price),
    stock = VALUES(stock);

INSERT INTO users (id, name, email)
VALUES (1, 'Rahul Reddy', 'rahul@cloudpulse.com')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    email = VALUES(email);

INSERT INTO orders (
    id,
    user_id,
    product_id,
    quantity,
    total_amount,
    status
)
VALUES (
    1,
    1,
    1,
    1,
    129999.00,
    'PLACED'
)
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    product_id = VALUES(product_id),
    quantity = VALUES(quantity),
    total_amount = VALUES(total_amount),
    status = VALUES(status);
