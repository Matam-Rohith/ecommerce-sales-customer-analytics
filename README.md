# E-Commerce Sales & Customer Analytics Platform

> Project — Skills: Python · SQL · Excel · Power BI · Statistics · Business Analytics · Data Cleaning · KPI Tracking

**Live Dashboard:** [View on GitHub Pages](https://matam-rohith.github.io/ecommerce-sales-customer-analytics/dashboard/index.html)


## Project Structure
```
├── index.html
├── dashboard/index.html        ← Interactive analytics dashboard
├── data/orders.csv             ← 1,800-row cleaned dataset
├── sql/analysis_queries.sql
├── python/analysis.py
├── insights/
│   ├── top_products.csv
│   ├── top_customers.csv
│   ├── rfm_segments.csv
│   ├── monthly_sales_forecast.csv
│   ├── category_profitability.csv
│   └── business_recommendations.md
└── README.md
```

## Skills Covered
| Skill | Coverage |
|---|---|
| Python (Pandas, NumPy) | RFM segmentation, KPIs, forecasting, profitability |
| SQL | CTEs, window functions, GROUP BY, JOINs, cohort |
| Excel/CSV | Pivot-table-ready, Power Query compatible |
| Power BI / Tableau | Import orders.csv and build 3-page report |
| Statistics | RFM quintile scoring, rolling averages, margin analysis |
| Business Analytics | KPI design, segmentation, recommendations |
| Data Cleaning | Consistent schema, calculated fields, no nulls |
| KPI Tracking | Revenue, Profit, AOV, Margin %, LTV, Retention |

## Dataset Schema
`order_id` `order_date` `customer_id` `customer_name` `city` `product_id` `product_name` `category` `quantity` `unit_cost` `unit_price` `discount` `revenue` `cost` `profit`

## Power BI Quick Start
1. Power BI Desktop → Get Data → CSV → `data/orders.csv`
2. New measure: `Profit Margin = DIVIDE(SUM([profit]),SUM([revenue]))`
3. Pages: Sales Trend · Customer Analysis · Product Performance

## KPI Summary
| KPI | Value |
|---|---|
| Total Revenue | ₹8.95L |
| Total Profit | ₹3.97L |
| Profit Margin | 44.3% |
| Orders | 1,800 |
| Top Product | Laptop |
| Best Margin Category | Fashion 63.8% |

---
Built by [Matam Rohith](https://rohith-portfolio-six.vercel.app/) · 2026
