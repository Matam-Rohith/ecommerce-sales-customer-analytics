-- =====================================================================
-- RETAILIQ ANALYTICS - PRODUCT INTELLIGENCE & DISCOUNT IMPACT
-- =====================================================================

-- 1. Product Performance Ranking (Revenue, Profit, Margin)
SELECT 
    p.product_id,
    p.product_name,
    p.category,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.line_total) AS total_revenue,
    SUM(oi.profit) AS total_profit,
    ROUND(SUM(oi.profit) * 100.0 / NULLIF(SUM(oi.line_total), 0), 2) AS profit_margin_pct,
    ROUND(AVG(oi.discount) * 100.0, 2) AS avg_discount_pct,
    DENSE_RANK() OVER (ORDER BY SUM(oi.line_total) DESC) AS revenue_rank,
    DENSE_RANK() OVER (ORDER BY SUM(oi.profit) DESC) AS profit_rank
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.product_name, p.category
ORDER BY total_revenue DESC;

-- 2. Discount Impact vs Profit Margin Analysis
-- Testing the hypothesis: Does heavy discounting increase revenue at the expense of healthy margins?
SELECT 
    p.category,
    CASE 
        WHEN oi.discount = 0 THEN '0% (No Discount)'
        WHEN oi.discount <= 0.05 THEN '1% - 5%'
        WHEN oi.discount <= 0.10 THEN '6% - 10%'
        ELSE '> 10% Deep Discount'
    END AS discount_tier,
    COUNT(oi.order_item_id) AS items_sold_count,
    SUM(oi.line_total) AS tier_revenue,
    SUM(oi.profit) AS tier_profit,
    ROUND(SUM(oi.profit) * 100.0 / NULLIF(SUM(oi.line_total), 0), 2) AS tier_margin_pct
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category, 
    CASE 
        WHEN oi.discount = 0 THEN '0% (No Discount)'
        WHEN oi.discount <= 0.05 THEN '1% - 5%'
        WHEN oi.discount <= 0.10 THEN '6% - 10%'
        ELSE '> 10% Deep Discount'
    END
ORDER BY p.category, tier_margin_pct DESC;

-- 3. Declining Products Identification (Q3 vs Q4 Growth)
WITH quarterly_product_sales AS (
    SELECT 
        oi.product_id,
        p.product_name,
        p.category,
        SUM(CASE WHEN o.order_date BETWEEN '2024-07-01' AND '2024-09-30' THEN oi.line_total ELSE 0 END) AS q3_revenue,
        SUM(CASE WHEN o.order_date BETWEEN '2024-10-01' AND '2024-12-31' THEN oi.line_total ELSE 0 END) AS q4_revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    GROUP BY oi.product_id, p.product_name, p.category
)
SELECT 
    product_id,
    product_name,
    category,
    q3_revenue,
    q4_revenue,
    ROUND((q4_revenue - q3_revenue) * 100.0 / NULLIF(q3_revenue, 0), 2) AS qoq_growth_pct,
    CASE 
        WHEN q4_revenue < q3_revenue THEN 'Declining'
        ELSE 'Growing / Stable'
    END AS trajectory_status
FROM quarterly_product_sales
WHERE q3_revenue > 0
ORDER BY qoq_growth_pct ASC;
