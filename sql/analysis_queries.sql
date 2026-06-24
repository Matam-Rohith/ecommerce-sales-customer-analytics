-- 1. Top revenue-generating products
SELECT product_name, category,
       SUM(revenue) AS total_revenue,
       SUM(quantity) AS units_sold,
       SUM(profit) AS total_profit
FROM orders
GROUP BY product_name, category
ORDER BY total_revenue DESC
LIMIT 10;

-- 2. Most valuable customers
SELECT customer_id, customer_name,
       SUM(revenue) AS lifetime_revenue,
       SUM(profit) AS lifetime_profit,
       COUNT(DISTINCT order_id) AS total_orders,
       MAX(order_date) AS last_order_date
FROM orders
GROUP BY customer_id, customer_name
ORDER BY lifetime_revenue DESC
LIMIT 10;

-- 3. RFM Analysis
WITH customer_rfm AS (
    SELECT customer_id, customer_name,
           JULIANDAY('2025-12-31') - JULIANDAY(MAX(order_date)) AS recency,
           COUNT(DISTINCT order_id) AS frequency,
           SUM(revenue) AS monetary
    FROM orders
    GROUP BY customer_id, customer_name
), rfm_scored AS (
    SELECT *,
           NTILE(5) OVER (ORDER BY recency DESC) AS r_score,
           NTILE(5) OVER (ORDER BY frequency) AS f_score,
           NTILE(5) OVER (ORDER BY monetary) AS m_score
    FROM customer_rfm
)
SELECT *,
       CASE
           WHEN r_score>=4 AND f_score>=4 AND m_score>=4 THEN 'Champions'
           WHEN r_score>=3 AND f_score>=3 THEN 'Loyal Customers'
           WHEN r_score>=4 AND f_score<=2 THEN 'Potential Loyalists'
           WHEN r_score<=2 AND f_score>=3 THEN 'At Risk'
           ELSE 'Others'
       END AS segment
FROM rfm_scored ORDER BY monetary DESC;

-- 4. Monthly sales trend
SELECT SUBSTR(order_date,1,7) AS order_month,
       SUM(revenue) AS monthly_revenue, SUM(profit) AS monthly_profit,
       COUNT(DISTINCT order_id) AS orders_count
FROM orders
GROUP BY SUBSTR(order_date,1,7)
ORDER BY order_month;

-- 5. Category profitability
SELECT category,
       SUM(revenue) AS total_revenue, SUM(profit) AS total_profit,
       ROUND(SUM(profit)*100.0/SUM(revenue),2) AS profit_margin_pct
FROM orders GROUP BY category ORDER BY profit_margin_pct DESC;

-- 6. Cohort retention
WITH first_purchase AS (
    SELECT customer_id, MIN(SUBSTR(order_date,1,7)) AS cohort_month
    FROM orders GROUP BY customer_id
), activity AS (
    SELECT o.customer_id, f.cohort_month, SUBSTR(o.order_date,1,7) AS activity_month
    FROM orders o JOIN first_purchase f ON o.customer_id=f.customer_id
    GROUP BY o.customer_id, f.cohort_month, SUBSTR(o.order_date,1,7)
)
SELECT cohort_month, activity_month,
       COUNT(DISTINCT customer_id) AS retained_customers
FROM activity GROUP BY cohort_month, activity_month
ORDER BY cohort_month, activity_month;
