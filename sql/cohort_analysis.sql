-- =====================================================================
-- RETAILIQ ANALYTICS - COHORT RETENTION ANALYSIS (Month-over-Month Matrix)
-- =====================================================================

WITH customer_first_order AS (
    -- Determine acquisition cohort month for each customer
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_date))::date AS cohort_month
    FROM orders
    GROUP BY customer_id
),
customer_orders_by_month AS (
    -- Track all activity months for each customer
    SELECT 
        o.customer_id,
        cfo.cohort_month,
        DATE_TRUNC('month', o.order_date)::date AS order_month,
        (DATE_PART('year', o.order_date) - DATE_PART('year', cfo.cohort_month)) * 12 +
        (DATE_PART('month', o.order_date) - DATE_PART('month', cfo.cohort_month)) AS month_number
    FROM orders o
    JOIN customer_first_order cfo ON o.customer_id = cfo.customer_id
    GROUP BY o.customer_id, cfo.cohort_month, DATE_TRUNC('month', o.order_date)::date, o.order_date
),
cohort_size AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT customer_id) AS total_customers
    FROM customer_first_order
    GROUP BY cohort_month
),
retention_matrix AS (
    SELECT 
        com.cohort_month,
        cs.total_customers AS cohort_size,
        com.month_number,
        COUNT(DISTINCT com.customer_id) AS active_customers,
        ROUND(COUNT(DISTINCT com.customer_id) * 100.0 / cs.total_customers, 1) AS retention_rate_pct
    FROM customer_orders_by_month com
    JOIN cohort_size cs ON com.cohort_month = cs.cohort_month
    GROUP BY com.cohort_month, cs.total_customers, com.month_number
)
SELECT 
    TO_CHAR(cohort_month, 'YYYY-MM') AS cohort,
    cohort_size,
    MAX(CASE WHEN month_number = 0 THEN retention_rate_pct END) AS m0_pct,
    MAX(CASE WHEN month_number = 1 THEN retention_rate_pct END) AS m1_pct,
    MAX(CASE WHEN month_number = 2 THEN retention_rate_pct END) AS m2_pct,
    MAX(CASE WHEN month_number = 3 THEN retention_rate_pct END) AS m3_pct,
    MAX(CASE WHEN month_number = 4 THEN retention_rate_pct END) AS m4_pct,
    MAX(CASE WHEN month_number = 5 THEN retention_rate_pct END) AS m5_pct,
    MAX(CASE WHEN month_number = 6 THEN retention_rate_pct END) AS m6_pct
FROM retention_matrix
GROUP BY cohort_month, cohort_size
ORDER BY cohort_month ASC;
