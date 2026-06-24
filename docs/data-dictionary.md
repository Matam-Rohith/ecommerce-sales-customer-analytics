# Data Dictionary

Definitions for every column in every file in this project.

---

## Primary Dataset — `data/orders.csv`

1,800 rows. One row per order line item. No null values.

| Column | Type | Range / Values | Description |
|---|---|---|---|
| order_id | String | O0001 – O1800 | Unique order identifier. Zero-padded 4-digit number with O prefix. |
| order_date | Date | 2024-01-01 to 2024-12-31 | Date the order was placed. ISO 8601 format (YYYY-MM-DD). |
| customer_id | String | C001 – C120 | Unique customer identifier. 120 distinct customers in the dataset. |
| customer_name | String | — | Customer full name. Indian names used to reflect target market. |
| city | String | 10 cities | Delivery city. Cities: Hyderabad, Bangalore, Mumbai, Delhi, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow. |
| product_id | String | P001 – P020 | Unique product identifier. 20 distinct products across 5 categories. |
| product_name | String | — | Product name (e.g., Laptop, Saree, Python Book). |
| category | String | 5 values | Product category: Electronics, Fashion, Furniture, Books, Grocery. |
| quantity | Integer | 1 – 4 | Number of units ordered in this line item. |
| unit_cost | Float (INR) | 80 – 25,000 | Cost price per single unit. Used to calculate profit. |
| unit_price | Float (INR) | 160 – 45,000 | Selling price per single unit before discount. |
| discount | Float | 0, 0.05, 0.10, 0.15 | Discount applied to the order. Stored as decimal (0.10 = 10% off). |
| revenue | Float (INR) | computed | Actual revenue collected. Formula: unit_price × quantity × (1 − discount). |
| cost | Float (INR) | computed | Total cost. Formula: unit_cost × quantity. |
| profit | Float (INR) | computed | Net profit on the order. Formula: revenue − cost. |

---

## Product Reference — 20 Products

| Product ID | Product Name | Category | Unit Cost (₹) | Unit Price (₹) | Base Margin |
|---|---|---|---|---|---|
| P001 | Laptop | Electronics | 25,000 | 45,000 | 44.4% |
| P002 | Smartphone | Electronics | 12,000 | 22,000 | 45.5% |
| P003 | Headphones | Electronics | 1,500 | 3,500 | 57.1% |
| P004 | Keyboard | Electronics | 800 | 1,800 | 55.6% |
| P005 | Monitor | Electronics | 7,000 | 14,000 | 50.0% |
| P006 | T-Shirt | Fashion | 200 | 600 | 66.7% |
| P007 | Jeans | Fashion | 500 | 1,400 | 64.3% |
| P008 | Sneakers | Fashion | 800 | 2,200 | 63.6% |
| P009 | Jacket | Fashion | 1,200 | 3,500 | 65.7% |
| P010 | Saree | Fashion | 900 | 2,800 | 67.9% |
| P011 | Sofa | Furniture | 8,000 | 18,000 | 55.6% |
| P012 | Dining Table | Furniture | 5,000 | 12,000 | 58.3% |
| P013 | Bookshelf | Furniture | 2,000 | 5,000 | 60.0% |
| P014 | Bed Frame | Furniture | 6,000 | 15,000 | 60.0% |
| P015 | Rice 5kg | Grocery | 200 | 350 | 42.9% |
| P016 | Cooking Oil | Grocery | 150 | 250 | 40.0% |
| P017 | Detergent | Grocery | 80 | 160 | 50.0% |
| P018 | Python Book | Books | 250 | 600 | 58.3% |
| P019 | Fiction Novel | Books | 120 | 300 | 60.0% |
| P020 | Self-Help Book | Books | 150 | 380 | 60.5% |

*Base Margin = (unit_price − unit_cost) / unit_price × 100. Effective margin will differ due to discounts.*

---

## Insights Files — `insights/`

### `top_products.csv`

| Column | Description |
|---|---|
| product_name | Product name |
| total_revenue | Sum of revenue across all orders for this product |
| total_profit | Sum of profit across all orders for this product |
| order_count | Number of orders containing this product |
| margin_pct | Effective profit margin % (total_profit / total_revenue × 100) |

### `top_customers.csv`

| Column | Description |
|---|---|
| customer_id | Customer identifier |
| customer_name | Customer full name |
| city | Customer delivery city |
| total_orders | Total number of orders placed |
| total_revenue | Lifetime revenue (LTV) in INR |
| total_profit | Lifetime profit contribution in INR |

### `rfm_segments.csv`

| Column | Description |
|---|---|
| customer_id | Customer identifier |
| recency_days | Days between last order and reference date (Jan 1, 2025). Lower is better. |
| frequency | Total orders placed by this customer |
| monetary | Total amount spent in INR |
| r_score | Recency score 1–5. 5 = purchased within last 30 days |
| f_score | Frequency score 1–5. 5 = 20+ orders |
| m_score | Monetary score 1–5. 5 = spent ₹2L+ |
| rfm_avg | Average of r_score, f_score, m_score |
| segment | Champions / Loyal / At-Risk / Potential / Lost |

### `monthly_sales_forecast.csv`

| Column | Description |
|---|---|
| month | Month in YYYY-MM format |
| actual_revenue | Actual total revenue for the month |
| actual_profit | Actual total profit for the month |
| rolling_3m_avg | 3-month rolling average revenue. Null for first 2 months. |
| forecast_flag | `actual` for months with real data, `forecast` for projected months |

### `category_profitability.csv`

| Column | Description |
|---|---|
| category | Product category |
| total_revenue | Total revenue for this category |
| total_profit | Total profit for this category |
| margin_pct | Effective margin % after discounts |
| order_count | Total orders in this category |
