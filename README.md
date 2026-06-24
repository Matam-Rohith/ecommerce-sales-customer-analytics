# E-Commerce Sales & Customer Analytics Platform

![Live](https://img.shields.io/badge/Live%20Dashboard-GitHub%20Pages-blue?style=flat-square&logo=github)
![Dataset](https://img.shields.io/badge/Dataset-1800%20Orders-green?style=flat-square)
![Tech](https://img.shields.io/badge/Stack-Python%20%7C%20SQL%20%7C%20Chart.js-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

An end-to-end business analytics project built to answer real sales and customer questions using Python, SQL, and an interactive web dashboard. The dataset covers 1,800 orders placed across 10 Indian cities throughout 2024, spanning 5 product categories and 120 unique customers.

**Live Dashboard:** [matam-rohith.github.io/ecommerce-sales-customer-analytics](https://matam-rohith.github.io/ecommerce-sales-customer-analytics/)

---

## Table of Contents

- [Why I Built This](#why-i-built-this)
- [Business Questions](#business-questions)
- [Project Structure](#project-structure)
- [Dataset](#dataset)
- [Dashboard](#dashboard)
- [KPI Summary](#kpi-summary)
- [Tech Stack](#tech-stack)
- [How to Run Locally](#how-to-run-locally)
- [Skills Demonstrated](#skills-demonstrated)
- [Author](#author)

---

## Why I Built This

I wanted to build something that goes beyond a simple chart tutorial. Most analytics portfolios stop at bar charts — I wanted to answer questions a real business manager would actually ask. So I designed a dataset that mirrors an Indian e-commerce company, wrote SQL queries with window functions and CTEs that a data analyst would run in production, built an RFM segmentation model from scratch in Python, and surfaced everything through a dashboard that works in any browser with no setup.

Every number in this project — revenue, profit, margins, customer segments — was computed from the raw CSV data. Nothing is hardcoded without a formula behind it.

---

## Business Questions

These are the questions I set out to answer before writing a single line of code:

1. Which products generate the most revenue, and which are most profitable?
2. Who are the most valuable customers, and how do we keep them?
3. How is monthly revenue trending — is the business growing?
4. Which cities should get more marketing spend?
5. What is the most efficient product category (best margin)?
6. Which customers are at risk of churning?

---

## Project Structure

```
ecommerce-sales-customer-analytics/
|
|-- index.html                     <- Root page, redirects to dashboard
|-- README.md                      <- Project overview (this file)
|-- CONTRIBUTING.md                <- How to contribute or extend the project
|
|-- dashboard/
|   `-- index.html                 <- Interactive Chart.js dashboard (live)
|
|-- data/
|   `-- orders.csv                 <- 1,800-row cleaned transactional dataset
|
|-- sql/
|   `-- analysis_queries.sql       <- SQL: KPIs, cohorts, window functions
|
|-- python/
|   `-- analysis.py                <- Python: RFM scoring, forecasting, margins
|
|-- insights/
|   |-- top_products.csv
|   |-- top_customers.csv
|   |-- rfm_segments.csv
|   |-- monthly_sales_forecast.csv
|   |-- category_profitability.csv
|   `-- business_recommendations.md
|
`-- docs/
    |-- architecture.md            <- Data flow and system design
    |-- data-dictionary.md         <- Column definitions for all files
    `-- business-insights.md       <- Key findings and recommendations
```

---

## Dataset

**File:** `data/orders.csv` | **1,800 rows** | **15 columns** | Jan 2024 – Dec 2024

I designed the schema to be realistic for an Indian retail business — Indian city names, INR pricing, Indian product mix (sarees alongside laptops), and a discount structure typical of e-commerce platforms.

| Column | Type | Description |
|---|---|---|
| order_id | String | Unique order ID (O0001–O1800) |
| order_date | Date | Transaction date |
| customer_id | String | Unique customer ID (C001–C120) |
| customer_name | String | Customer full name |
| city | String | Delivery city |
| product_id | String | Product ID (P001–P020) |
| product_name | String | Product name |
| category | String | Electronics, Fashion, Furniture, Books, Grocery |
| quantity | Integer | Units ordered (1–4) |
| unit_cost | Float | Cost price per unit (INR) |
| unit_price | Float | Selling price per unit (INR) |
| discount | Float | Discount rate (0, 0.05, 0.10, 0.15) |
| revenue | Float | unit_price × quantity × (1 − discount) |
| cost | Float | unit_cost × quantity |
| profit | Float | revenue − cost |

See the full data dictionary: [`docs/data-dictionary.md`](docs/data-dictionary.md)

---

## Dashboard

The live dashboard is a single HTML file using Chart.js 4.4. No frameworks, no build steps — just HTML, CSS, and JavaScript, which means it loads instantly and works offline too.

**Charts included:**

| Chart | Type | What it shows |
|---|---|---|
| Monthly Revenue vs Profit | Line | 12-month trend with both series |
| Revenue by Category | Doughnut | Share of total revenue per category |
| Category Profit Margin % | Bar | Effective margin % per category |
| Top 8 Products by Revenue | Horizontal Bar | Revenue ranking |
| Revenue by City | Horizontal Bar | Geographic revenue distribution |
| RFM Customer Segments | Polar Area | Champions vs Loyal vs At-Risk count |

The design uses a dark theme (#0f172a background) with a blue accent palette, matching the aesthetic of professional BI tools like Power BI dark mode.

---

## KPI Summary

| Metric | Value |
|---|---|
| Total Revenue | ₹298.68L |
| Total Profit | ₹148.59L |
| Profit Margin | 49.7% |
| Total Orders | 1,800 |
| Unique Customers | 120 |
| Avg Order Value | ₹16,593 |
| Top Product by Revenue | Laptop |
| Highest Margin Category | Fashion (63.8%) |
| Top Revenue City | Hyderabad |

---

## Tech Stack

| Tool | How I used it |
|---|---|
| Python (Pandas, NumPy) | RFM segmentation, KPI calculation, 3-month rolling forecast |
| SQL (MySQL 8+) | CTEs, window functions, GROUP BY, cohort retention |
| Chart.js 4.4 | Six interactive chart types in the dashboard |
| HTML / CSS | Responsive dark-theme dashboard layout |
| GitHub Pages | Live hosting of the dashboard |
| CSV / Excel | Power BI and Tableau compatible output files |

---

## How to Run Locally

### View the Dashboard
```bash
git clone https://github.com/Matam-Rohith/ecommerce-sales-customer-analytics.git
cd ecommerce-sales-customer-analytics
open index.html        # macOS
start index.html       # Windows
# Or just drag index.html into any browser
```

### Run the Python Analysis
```bash
cd python
pip install pandas numpy
python analysis.py
# Generates: insights/*.csv
```

### Run the SQL Queries
```sql
-- 1. Create and populate the orders table in MySQL:
LOAD DATA INFILE 'data/orders.csv'
INTO TABLE orders
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- 2. Run the queries in:
--    sql/analysis_queries.sql
```

### Power BI
1. Open Power BI Desktop → Get Data → Text/CSV → select `data/orders.csv`
2. Add measure: `Profit Margin = DIVIDE(SUM([profit]), SUM([revenue]))`
3. Build three report pages: Sales Trend, Customer Analysis, Product Performance

---

## Skills Demonstrated

| Skill | What I did |
|---|---|
| Python / Pandas | Wrote RFM scoring logic, computed quintile-based segment labels, built rolling averages |
| SQL | Used CTEs for multi-step analysis, ROW_NUMBER() for rankings, LAG() for month-over-month comparison |
| Data Cleaning | Designed schema with no nulls, consistent types, and pre-calculated derived columns |
| Statistics | Applied quintile scoring for R/F/M dimensions, calculated rolling 3-month baselines |
| Data Visualization | Built six chart types with custom dark theme, tooltips, and responsive layout |
| Business Thinking | Translated data patterns into specific, actionable recommendations |
| Web Development | Single-file dashboard with no dependencies beyond a CDN, works offline |
| Deployment | Configured GitHub Pages for live hosting with root redirect |

---

## Author

**Matam Rohith**  
Full-Stack Developer | Data Analytics | Java · JavaScript · SQL · Python  
Hyderabad, Telangana, India

- Portfolio: [rohith-portfolio-six.vercel.app](https://rohith-portfolio-six.vercel.app/)
- GitHub: [github.com/Matam-Rohith](https://github.com/Matam-Rohith)

---

*Open for entry-level software development, data analytics, and QA automation roles — 2026*
