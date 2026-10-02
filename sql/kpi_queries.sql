-- =====================================================================
-- RETAILIQ ANALYTICS - EXECUTIVE & KPI QUERIES (Window Functions & CTEs)
-- =====================================================================

-- 1. High-Level Executive Summary
SELECT 
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(DISTINCT o.customer_id) AS total_customers,
    SUM(oi.line_total) AS total_revenue,
    SUM(oi.profit) AS total_profit,
    ROUND(SUM(oi.profit) * 100.0 / NULLIF(SUM(oi.line_total), 0), 2) AS profit_margin_pct,
    ROUND(SUM(oi.line_total) / NULLIF(COUNT(DISTINCT o.order_id), 0), 2) AS avg_order_value
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id;

-- 2. Monthly Revenue Trend with MoM Growth & Rolling 3-Month Average
WITH monthly_sales AS (
    SELECT 
        TO_CHAR(o.order_date, 'YYYY-MM') AS sales_month,
        SUM(oi.line_total) AS monthly_revenue,
        SUM(oi.profit) AS monthly_profit,
        COUNT(DISTINCT o.order_id) AS order_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
)
SELECT 
    sales_month,
    monthly_revenue,
    monthly_profit,
    order_count,
    ROUND((monthly_revenue - LAG(monthly_revenue, 1) OVER (ORDER BY sales_month)) 
          * 100.0 / NULLIF(LAG(monthly_revenue, 1) OVER (ORDER BY sales_month), 0), 2) AS mom_growth_pct,
    ROUND(AVG(monthly_revenue) OVER (ORDER BY sales_month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS rolling_3m_avg_revenue
FROM monthly_sales
ORDER BY sales_month;

-- 3. Category Profitability Breakdown
SELECT 
    p.category,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.line_total) AS revenue,
    SUM(oi.profit) AS profit,
    ROUND(SUM(oi.profit) * 100.0 / NULLIF(SUM(oi.line_total), 0), 2) AS profit_margin_pct,
    ROUND(SUM(oi.line_total) * 100.0 / SUM(SUM(oi.line_total)) OVER (), 2) AS revenue_contribution_pct
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
GROUP BY p.category
ORDER BY revenue DESC;

-- 4. Regional Performance (Revenue by City & State)
SELECT 
    c.city,
    c.state,
    COUNT(DISTINCT c.customer_id) AS customer_count,
    COUNT(DISTINCT o.order_id) AS order_count,
    SUM(oi.line_total) AS total_revenue,
    SUM(oi.profit) AS total_profit,
    ROUND(SUM(oi.profit) * 100.0 / NULLIF(SUM(oi.line_total), 0), 2) AS margin_pct,
    DENSE_RANK() OVER (ORDER BY SUM(oi.line_total) DESC) AS city_rank
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.city, c.state
ORDER BY total_revenue DESC;
