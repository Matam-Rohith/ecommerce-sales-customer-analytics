-- =====================================================================
-- RETAILIQ ANALYTICS PLATFORM - RELATIONAL DATABASE SCHEMA (PostgreSQL / MySQL)
-- =====================================================================

-- 1. Dim Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(10) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    signup_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dim Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cost_price DECIMAL(12, 2) NOT NULL,
    base_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Fact Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Completed',
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Fact Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id VARCHAR(12) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(10) NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(4, 2) DEFAULT 0.00,
    line_total DECIMAL(12, 2) NOT NULL,
    profit DECIMAL(12, 2) NOT NULL
);

-- 5. Fact Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(12) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Success',
    amount DECIMAL(12, 2) NOT NULL
);

-- Performance Indexes for Analytics Queries
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
