-- =====================================================================
-- RETAILIQ ANALYTICS - CUSTOMER INTELLIGENCE & RFM SEGMENTATION
-- =====================================================================

-- 1. Full RFM Scoring and Behavioral Segmentation Model
WITH customer_metrics AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.city,
        c.signup_date,
        -- Reference date is Dec 31, 2024
        DATE_PART('day', '2024-12-31'::timestamp - MAX(o.order_date)::timestamp) AS recency_days,
        COUNT(DISTINCT o.order_id) AS frequency,
        SUM(oi.line_total) AS monetary,
        SUM(oi.profit) AS customer_profit
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY c.customer_id, c.customer_name, c.city, c.signup_date
),
rfm_scores AS (
    SELECT 
        customer_id,
        customer_name,
        city,
        recency_days,
        frequency,
        monetary,
        customer_profit,
        NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,   -- Lower recency days = higher score
        NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,        -- Higher frequency = higher score
        NTILE(5) OVER (ORDER BY monetary ASC) AS m_score          -- Higher spend = higher score
    FROM customer_metrics
)
SELECT 
    customer_id,
    customer_name,
    city,
    recency_days,
    frequency,
    monetary,
    customer_profit,
    r_score,
    f_score,
    m_score,
    CASE 
        WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
        WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal'
        WHEN r_score >= 4 AND f_score <= 2 THEN 'Potential Loyalists'
        WHEN r_score <= 2 AND f_score >= 3 THEN 'At Risk'
        ELSE 'Lost'
    END AS rfm_segment,
    ROUND(monetary / NULLIF(frequency, 0), 2) AS aov,
    -- Estimated Customer Lifetime Value (CLV = AOV * Purchase Frequency * Gross Margin % * Lifespan factor)
    ROUND((monetary / NULLIF(frequency, 0)) * frequency * (customer_profit / NULLIF(monetary, 0)) * 1.5, 2) AS estimated_clv
FROM rfm_scores
ORDER BY monetary DESC;

-- 2. Customer Repeat Purchase Rate & Retention Summary
WITH customer_orders AS (
    SELECT 
        customer_id,
        COUNT(order_id) AS total_orders
    FROM orders
    GROUP BY customer_id
)
SELECT 
    COUNT(customer_id) AS total_customers,
    COUNT(CASE WHEN total_orders > 1 THEN 1 END) AS repeat_customers,
    ROUND(COUNT(CASE WHEN total_orders > 1 THEN 1 END) * 100.0 / COUNT(customer_id), 2) AS repeat_purchase_rate_pct,
    COUNT(CASE WHEN total_orders = 1 THEN 1 END) AS one_time_buyers
FROM customer_orders;
