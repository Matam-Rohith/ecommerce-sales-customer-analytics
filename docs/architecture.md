# System Architecture & Data Flow

This document explains how the project is structured, how data moves through each layer, and why I made the design choices I did.

---

## Overview

The project has five layers, each with a clear responsibility:

```
[ DATA LAYER ]
  data/orders.csv
  1,800 rows · 15 columns · Jan-Dec 2024
        |
        |-- [ ANALYSIS LAYER - Python ]
        |     python/analysis.py
        |     Pandas: RFM scoring, KPI calc, rolling forecast
        |
        |-- [ ANALYSIS LAYER - SQL ]
              sql/analysis_queries.sql
              CTEs, window functions, cohort queries
                    |
             [ INSIGHTS LAYER ]
               insights/*.csv
               Pre-aggregated output files
                    |
          [ PRESENTATION LAYER ]
            dashboard/index.html
            Chart.js · Dark theme · GitHub Pages
```

---

## Layer 1 — Data (`data/orders.csv`)

The dataset is the foundation of everything. I designed the schema before collecting any data to make sure every column would be useful in at least one analysis.

**Key decisions:**
- Pre-calculated `revenue`, `cost`, and `profit` columns so SQL and Python queries stay clean
- `discount` stored as a decimal (0.10 not 10%) so the revenue formula is consistent: `unit_price × quantity × (1 − discount)`
- `order_date` in ISO format (YYYY-MM-DD) so it sorts correctly as a string and parses cleanly in both Python and MySQL
- Kept the schema flat (one row per order line) rather than normalizing into separate product/customer tables — this makes it much easier to import into Power BI or Excel without joins

---

## Layer 2 — Python Analysis (`python/analysis.py`)

The Python script runs four analyses:

**1. KPI Computation**
Basic aggregations — total revenue, total profit, margin %, order count, AOV, unique customer count.

**2. RFM Segmentation**
Each customer gets three scores:
- **Recency** — days since their last order (lower = better customer)
- **Frequency** — total number of orders
- **Monetary** — total spend

Each dimension is scored 1–5 using quintile breakpoints. The average of the three scores determines the segment label: Champions (≥4.5), Loyal (≥3.5), At-Risk (≥2.5), Potential (≥1.5), Lost (<1.5).

**3. Rolling Forecast**
A 3-month rolling average is computed on monthly revenue. The last 3 months of the rolling average serve as a simple baseline forecast for the next quarter.

**4. Category Profitability**
Grouped by category to compute effective margin % after discounts, sorted descending.

**Output:** All results are written to `insights/*.csv`.

---

## Layer 3 — SQL Analysis (`sql/analysis_queries.sql`)

The SQL queries answer the same business questions as the Python layer but using set-based operations. I wrote these to demonstrate specific SQL skills:

| Technique | Query purpose |
|---|---|
| GROUP BY + HAVING | Revenue and order count by category, filtered to top performers |
| Window functions (RANK, ROW_NUMBER) | Product and customer leaderboards |
| LAG() | Month-over-month revenue comparison |
| SUM() OVER (ORDER BY) | Running total revenue |
| CTE (WITH clause) | Multi-step RFM calculation broken into readable stages |
| Self-join / cohort | Customer retention by acquisition month |

---

## Layer 4 — Insights (`insights/`)

Pre-computed aggregated files ready for direct import into:
- Power BI (Get Data → CSV)
- Tableau (Connect → Text File)
- Excel (Data → From Text/CSV)
- Google Sheets (File → Import)

These exist separately from the raw data so that a business stakeholder can use the outputs without needing to run any code.

---

## Layer 5 — Dashboard (`dashboard/index.html`)

The dashboard is intentionally a single self-contained HTML file. I chose this approach because:

- **No build step** — no npm, no webpack, no node_modules. Clone the repo and open the file.
- **Works offline** — the only external dependency is the Chart.js CDN script tag. If you save the file locally with the CDN loaded once, it works without internet.
- **GitHub Pages compatible** — static files deploy directly with no configuration.
- **Zero framework overhead** — for a portfolio project, React or Vue would add complexity without any real benefit.

**Chart.js was chosen over D3.js** because D3 requires writing SVG path logic for every chart type, which is significant extra code for charts that Chart.js handles natively. D3 is better suited for custom, non-standard visualizations.

---

## Deployment

| Environment | URL | Method |
|---|---|---|
| Production | https://matam-rohith.github.io/ecommerce-sales-customer-analytics/ | GitHub Pages, main branch |
| Local | Open index.html in browser | No server needed |

GitHub Pages is configured to serve from the root of the `main` branch. The root `index.html` contains a meta-refresh redirect to `dashboard/index.html`, so the live URL loads the dashboard directly.
