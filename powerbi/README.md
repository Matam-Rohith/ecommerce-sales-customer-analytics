# RetailIQ — Power BI Executive Reporting Suite

This directory contains the professional Business Intelligence reporting deliverables for **RetailIQ — E-Commerce Sales & Customer Intelligence Platform**.

## Data Model (Star Schema)

The Power BI model connects to the pre-modeled dimensional CSVs located in `data/processed/` or the PostgreSQL database:

```
          dim_customers (1:N) ────┐
                                  ▼
dim_products (1:N) ───────► fact_order_items (N:1) ◄────── fact_orders (1:N)
                                                                 ▲
                                                                 │
                                                       fact_payments (1:1)
```

### Relationships:
1. `dim_customers[customer_id]` ──► `fact_orders[customer_id]` (1 to Many, Single direction)
2. `dim_products[product_id]` ──► `fact_order_items[product_id]` (1 to Many, Single direction)
3. `fact_orders[order_id]` ──► `fact_order_items[order_id]` (1 to Many, Both directions)
4. `fact_orders[order_id]` ──► `fact_payments[order_id]` (1 to 1)

---

## 5-Page Report Blueprint

### Page 1: Executive Overview
- **Header KPIs**: Total Revenue (₹ Lakhs), Total Profit, Gross Margin %, Orders, Customers, AOV
- **Visuals**:
  - Monthly Revenue vs. Profit Area Chart with 3-Month Moving Average
  - Category Profitability Matrix with conditional color formatting
  - Slicers: Date Range, Region/City, Product Category

### Page 2: Customer Intelligence
- **RFM Segmentation Matrix**: Scatter plot of Recency vs. Frequency with Monetary bubble size
- **Customer Cohort Retention Grid**: Month-over-month retention heatmap
- **Top 10 High-CLV Customers**: Table with Customer Name, Segment, Lifetime Spend, Estimated CLV

### Page 3: Product & Profitability
- **Pareto Revenue Analysis**: Cumulative % Revenue curve by Product
- **Discount Sensitivity**: Scatter plot of Discount % vs. Profit Margin %
- **Declining Catalog Alert**: Bottom 5 products with negative QoQ revenue growth

### Page 4: Regional Performance
- **Map & Filled Map**: Revenue and Margin distribution across 10 Indian metropolitan cities
- **City Tier Comparison**: Hyderabad, Bangalore, and Mumbai market penetration

### Page 5: Forecast & Trends
- **3-Month Forward Projection**: Historical sales with 95% Confidence Interval upper & lower bounds
- **Seasonality Index**: Month-over-month index decomposition

---

## DAX Measures
All production-ready DAX measures are documented in `powerbi/DAX_Measures.dax`.
