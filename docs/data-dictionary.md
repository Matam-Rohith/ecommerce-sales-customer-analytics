# RetailIQ Data Dictionary

## 1. Relational Entities (PostgreSQL / MySQL)

### `customers` (`dim_customers`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `customer_id` | VARCHAR(10) | PRIMARY KEY | Unique customer identifier (e.g. C001–C120) |
| `customer_name` | VARCHAR(100) | NOT NULL | Customer full legal name |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Customer contact email |
| `city` | VARCHAR(50) | NOT NULL | Primary delivery city hub |
| `state` | VARCHAR(50) | NOT NULL | Indian state/territory |
| `signup_date` | DATE | NOT NULL | Customer acquisition date (earliest order date) |

### `products` (`dim_products`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | VARCHAR(10) | PRIMARY KEY | Unique catalog SKU (P001–P020) |
| `product_name` | VARCHAR(100) | NOT NULL | Commercial product name |
| `category` | VARCHAR(50) | NOT NULL | Product vertical (Electronics, Furniture, Fashion, Books, Grocery) |
| `cost_price` | DECIMAL(12,2) | NOT NULL | Wholesale procurement unit cost in INR (₹) |
| `base_price` | DECIMAL(12,2) | NOT NULL | Base catalog selling price in INR (₹) |

### `orders` (`fact_orders`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `order_id` | VARCHAR(10) | PRIMARY KEY | Unique transaction identifier (O0001–O1800) |
| `customer_id` | VARCHAR(10) | FOREIGN KEY | References `customers(customer_id)` |
| `order_date` | DATE | NOT NULL | Transaction fulfillment date |
| `status` | VARCHAR(20) | DEFAULT 'Completed'| Order lifecycle status |
| `total_amount` | DECIMAL(12,2) | NOT NULL | Net order invoice amount after discounts (₹) |

### `order_items` (`fact_order_items`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `order_item_id` | VARCHAR(12) | PRIMARY KEY | Unique line item identifier (OI0001–OI1800) |
| `order_id` | VARCHAR(10) | FOREIGN KEY | References `orders(order_id)` |
| `product_id` | VARCHAR(10) | FOREIGN KEY | References `products(product_id)` |
| `quantity` | INT | NOT NULL | Units purchased (> 0) |
| `unit_price` | DECIMAL(12,2) | NOT NULL | Selling price per unit (₹) |
| `discount` | DECIMAL(4,2) | DEFAULT 0.00 | Promotional discount rate (0.00 – 0.15) |
| `line_total` | DECIMAL(12,2) | NOT NULL | Net line item revenue (₹) |
| `profit` | DECIMAL(12,2) | NOT NULL | Gross profit: `line_total - (cost_price * quantity)` |

### `payments` (`fact_payments`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `payment_id` | VARCHAR(12) | PRIMARY KEY | Unique settlement token (PAY0001–PAY1800) |
| `order_id` | VARCHAR(10) | FOREIGN KEY | References `orders(order_id)` |
| `payment_date` | DATE | NOT NULL | Settlement date |
| `payment_method` | VARCHAR(30) | NOT NULL | Settlement instrument (UPI, Credit Card, Net Banking, etc.) |
| `payment_status` | VARCHAR(20) | DEFAULT 'Success' | Transaction status |
| `amount` | DECIMAL(12,2) | NOT NULL | Total transaction settlement (₹) |

---

## 2. Analytical & Statistical Metrics

| Metric | Calculation / Formula | Business Meaning |
|---|---|---|
| **AOV** | `SUM(Revenue) / COUNT(DISTINCT Order_ID)` | Average revenue per basket |
| **Gross Margin %** | `SUM(Profit) / SUM(Revenue) * 100` | Operational profitability efficiency |
| **CLV (24-Mo)** | `AOV * Frequency * Gross Margin % * 1.6` | Projected 2-year forward value of account |
| **Repeat Rate %** | `COUNT(Repeat Customers) / Total Customers * 100` | Retention & loyalty strength |
| **Z-Score** | `(Daily_Revenue - Baseline_Mean) / StdDev` | Statistical anomaly outlier detector |
| **95% CI** | `Forecast ± 1.96 * StdDev * sqrt(step)` | Predictive uncertainty boundary |
