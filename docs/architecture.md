# RetailIQ Architecture & System Design

```
                       RETAILIQ
             E-COMMERCE ANALYTICS PLATFORM

                         USER
                          │
                          ▼
                    React Frontend
                          │
                    REST API / JWT
                          │
                          ▼
                  Node / Express / FastAPI
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
        PostgreSQL              Analytics Engine
      (5 Star Schema)           Python / Pandas
             │                         │
             │              ┌──────────┼──────────┐
             │              ▼          ▼          ▼
             │             RFM     Forecasting  Anomaly
             │              │          │          │
             └──────────────┴──────────┴──────────┘
                          │
                          ▼
                    Verified KPIs
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
             React UI           Power BI
                 │
                 ▼
          AI Business Insights (Gemini LLM)
```

## System Components

1. **Relational Database Layer (PostgreSQL)**
   - Normalized 3NF & dimensional star schema:
     - `dim_customers` (PK: customer_id)
     - `dim_products` (PK: product_id)
     - `fact_orders` (PK: order_id, FK: customer_id)
     - `fact_order_items` (PK: order_item_id, FK: order_id, product_id)
     - `fact_payments` (PK: payment_id, FK: order_id)

2. **Analytical Engine Layer (Python / Pandas / SQL)**
   - `analytics/rfm_analysis.py`: 5-quintile behavioral scoring.
   - `analytics/customer_analysis.py`: Cohort retention matrices & Customer Lifetime Value (CLV).
   - `analytics/product_analysis.py`: Elasticity, discount degradation, and declining catalog detection.
   - `analytics/forecasting.py`: Holt-Winters Exponential Smoothing (α=0.35) with 95% Confidence Bounds.
   - `analytics/anomaly_detection.py`: Z-score and IQR threshold breach flagging.

3. **REST Application Layer (Node.js Express / FastAPI)**
   - High throughput endpoints for executive KPIs, time-series trends, customer profiles, and data upload.

4. **Executive Dashboard Layer (React + Chart.js + Tailwind CSS)**
   - Global interactive filtering (Date, City, Category, Product, RFM Segment).
   - 9 Dedicated intelligence views.

5. **Power BI Deliverables**
   - 5-Page executive report with Star Schema relationship model and production DAX measures.
