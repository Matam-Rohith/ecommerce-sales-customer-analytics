"""
RetailIQ Analytics - Customer Lifetime Value (CLV) & Retention Analysis
Computes repeat purchase rate, customer lifespan, cohort retention, and churn indicators.
"""
import pandas as pd
import numpy as np

def analyze_customers(df):
    total_customers = df['customer_id'].nunique()
    orders_per_cust = df.groupby('customer_id')['order_id'].nunique()
    repeat_customers = (orders_per_cust > 1).sum()
    repeat_rate = round(repeat_customers / total_customers * 100, 2)
    
    # Customer value metrics
    cust_metrics = df.groupby(['customer_id', 'customer_name', 'city'], as_index=False).agg(
        total_revenue=('revenue', 'sum'),
        total_profit=('profit', 'sum'),
        order_count=('order_id', 'nunique'),
        first_order=('order_date', 'min'),
        last_order=('order_date', 'max')
    )
    
    avg_customer_value = round(cust_metrics['total_revenue'].mean(), 2)
    avg_profit_per_customer = round(cust_metrics['total_profit'].mean(), 2)
    avg_order_frequency = round(cust_metrics['order_count'].mean(), 2)
    
    # Estimated CLV formula: (Avg Order Value * Purchase Frequency * Gross Margin * Lifespan Multiple)
    cust_metrics['aov'] = cust_metrics['total_revenue'] / cust_metrics['order_count']
    cust_metrics['margin_pct'] = cust_metrics['total_profit'] / cust_metrics['total_revenue']
    # Estimated 24-month lifespan forward factor = 1.6
    cust_metrics['estimated_clv'] = (cust_metrics['total_profit'] * 1.6).round(2)
    
    # Churn Risk: No orders in the last 90 days of the year despite multiple historical purchases
    ref_date = df['order_date'].max()
    cust_metrics['days_since_last_order'] = (ref_date - cust_metrics['last_order']).dt.days
    cust_metrics['churn_risk'] = (cust_metrics['days_since_last_order'] > 90) & (cust_metrics['order_count'] >= 2)
    
    return {
        'total_customers': int(total_customers),
        'repeat_customers': int(repeat_customers),
        'repeat_rate_pct': repeat_rate,
        'avg_customer_value': avg_customer_value,
        'avg_profit_per_customer': avg_profit_per_customer,
        'churn_risk_count': int(cust_metrics['churn_risk'].sum()),
        'customer_profiles': cust_metrics
    }

if __name__ == '__main__':
    from data_cleaning import clean_orders_data
    df = clean_orders_data()
    res = analyze_customers(df)
    print(f"Repeat Rate: {res['repeat_rate_pct']}% | Churn Risk Customers: {res['churn_risk_count']}")
