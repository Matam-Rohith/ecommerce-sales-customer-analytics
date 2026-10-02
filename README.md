# RetailIQ — E-Commerce Sales & Customer Intelligence Platform

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL%20%7C%20Python%20%7C%20Power%20BI-blue?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-1800%20Orders-green?style=flat-square)
![RFM](https://img.shields.io/badge/Analytics-RFM%20%2B%20CLV%20%2B%20Forecasting-orange?style=flat-square)
![Architecture](https://img.shields.io/badge/Full--Stack-True%20BI%20Platform-brightgreen?style=flat-square)

An enterprise-grade, full-stack Business Intelligence & Customer Analytics platform built for Indian retail e-commerce. RetailIQ upgrades transactional data into actionable predictive insights across 1,800 orders, 120 customers, 20 products, and 10 metropolitan hubs.

---

## 🏗 Platform Architecture

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

---

## 🚀 Key Upgrades & Highlights

1. **Relational Database Model (PostgreSQL / MySQL)**
   - Replaced flat CSV with 5 normalized tables: `customers`, `products`, `orders`, `order_items`, `payments`.
   - Comprehensive SQL queries in `sql/` utilizing Window Functions, CTEs, and cohort retention grids.

2. **Modular Python Analytics Pipeline (`analytics/`)**
   - `data_cleaning.py`: Automated schema validation, data type sanitation, and integrity checks.
   - `rfm_analysis.py`: Quintile behavioral scoring (1-5) and 5-segment mapping (Champions, Loyal, Potential Loyalists, At Risk, Lost).
   - `customer_analysis.py`: Repeat purchase rate, 24-month forward Customer Lifetime Value (CLV), and churn risk detection.
   - `product_analysis.py`: Unit margin decomposition, discount elasticity, and declining product watchlists.
   - `forecasting.py`: Holt-Winters Exponential Smoothing (α=0.35) with 95% Confidence Intervals.
   - `anomaly_detection.py`: Z-score and IQR statistical outlier detection for revenue spikes, drops, and discount breaches.
   - `pipeline.py`: Master orchestration workflow.

3. **Modern React Executive Dashboard (`frontend/` & `src/`)**
   - Built with React, Tailwind CSS, and Chart.js.
   - 9 Dedicated intelligence views:
     - **Executive Dashboard:** High-level C-suite metrics, monthly revenue vs profit, category and city distributions.
     - **Customer Intelligence:** RFM quintile matrix, Month-over-Month cohort retention heatmap, and Customer 360 drilldown.
     - **Product Intelligence:** Margin yield ranking and Discount vs Profit margin elasticity analysis.
     - **Sales & Forecasting:** 3-month forward projection with upper/lower 95% confidence intervals.
     - **Regional Performance:** Metropolitan hub analysis across 10 Indian cities.
     - **Anomaly Detection:** Real-time heuristic alerts for revenue spikes, drops, and policy breaches.
     - **AI Business Insights:** Verified KPIs synthesized into C-suite narrative briefings with Gemini 3.8 Flash.
     - **Data Upload & Validation:** Drag-and-drop CSV validation checklist and live database ingestion.
     - **Power BI Suite:** 5-Page report blueprints, DAX formulas, and VertiPaq data models.

4. **Global Interactive Filters**
   - Real-time dynamic filtering across Date Range, City, Category, Product, and RFM Customer Segment.

5. **Power BI Deliverables (`powerbi/`)**
   - 5-page enterprise reporting suite (`powerbi/RetailIQ_Report_Guide.md`, `DAX_Measures.dax`).
   - Modeled dimensional exports (`data/processed/dim_customers.csv`, `dim_products.csv`, etc.).

6. **Docker & Local Deployment**
   - Single command deployment via `docker-compose.yml` (PostgreSQL + FastAPI Backend + React Frontend).

---

## ⚡ Deploying to Vercel

RetailIQ is pre-configured for one-click deployment on [Vercel](https://vercel.com/):

### Option A: Via Vercel Web Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** → **Project**, and select your GitHub repository (`ecommerce-sales-customer-analytics`).
3. Vercel automatically detects the preset from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* Add Environment Variable:
   - `GEMINI_API_KEY`: *(Optional, for live Gemini AI Executive briefings)*
5. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

The configuration in `vercel.json` and `api/index.js` handles:
- **Serverless API routing**: Routes all `/api/*` requests to the Express engine.
- **Client-Side SPA rewrites**: Prevents 404 errors on page reloads and deep links.
- **Automatic Fallback**: If backend functions encounter cold starts or limits, the built-in client analytics engine (`localDb`) keeps the UI and charts active.

---

## 🌐 Deploying to GitHub Pages

This app is configured to build and deploy to GitHub Pages automatically:

### Option A: Automated GitHub Actions (Recommended)
1. Push this repository to GitHub.
2. Go to your repository **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build the Vite app and publish it to `https://<username>.github.io/<repo-name>/`.

### Option B: Manual Deploy via CLI
```bash
npm run deploy
```
*(This builds the static bundle and pushes it to your `gh-pages` branch).*

> **Note on Static Hosting:** GitHub Pages is a static host (no Node.js server). The app has an embedded client-side analytics database fallback (`src/services/localDatabase.ts`) so that all 9 dashboard tabs, interactive filters, RFM models, charts, and forecasts work in the browser without requiring a backend server.

---

## 🏃 Quick Start (Docker)

```bash
docker compose up -d
```
- React Frontend: `http://localhost:3000`
- FastAPI Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 📡 REST API Endpoints

- `GET /api/dashboard/kpis` - Executive KPI summary
- `GET /api/sales/trend` - Monthly revenue, profit, and margins
- `GET /api/sales/forecast` - 3-Month forecast with 95% Confidence Bounds
- `GET /api/customers/segments` - RFM customer counts and CLV
- `GET /api/customers/cohorts` - Month-over-Month cohort retention matrix
- `GET /api/products/intelligence` - Discount impact and margin analysis
- `GET /api/anomalies` - Statistical outliers and alert feeds
- `GET /api/insights` - Verified calculated business findings
- `POST /api/insights/generate-ai` - AI narrative synthesis (Gemini API)
- `POST /api/upload` - CSV schema verification and relational ETL pipeline

---

## 👤 Author
**Matam Rohith** · [Portfolio](https://rohith-portfolio-six.vercel.app/) · [GitHub](https://github.com/Matam-Rohith/ecommerce-sales-customer-analytics)
