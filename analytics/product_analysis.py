"""
RetailIQ Analytics - Product Intelligence & Discount Impact Engine
Analyzes product revenues, margins, discount elasticities, and declining catalog items.
"""
import pandas as pd
import numpy as np

def analyze_products(df):
    prod_summary = df.groupby(['product_id', 'product_name', 'category'], as_index=False).agg(
        units_sold=('quantity', 'sum'),
        total_revenue=('revenue', 'sum'),
        total_profit=('profit', 'sum'),
        avg_discount=('discount', 'mean'),
        order_count=('order_id', 'nunique')
    )
    prod_summary['profit_margin_pct'] = (prod_summary['total_profit'] / prod_summary['total_revenue'] * 100).round(2)
    prod_summary['avg_price'] = (prod_summary['total_revenue'] / prod_summary['units_sold']).round(2)
    
    # Sort top revenue and top profit
    top_revenue = prod_summary.sort_values('total_revenue', ascending=False).reset_index(drop=True)
    top_profit = prod_summary.sort_values('total_profit', ascending=False).reset_index(drop=True)
    lowest_margin = prod_summary.sort_values('profit_margin_pct', ascending=True).reset_index(drop=True)
    
    # Discount impact vs profit margin
    df['discount_bucket'] = pd.cut(
        df['discount'], 
        bins=[-0.01, 0.001, 0.05, 0.10, 1.0], 
        labels=['0% (Full Price)', '1% - 5%', '6% - 10%', '> 10% Heavy Discount']
    )
    discount_impact = df.groupby(['category', 'discount_bucket'], observed=False).agg(
        units=('quantity', 'sum'),
        revenue=('revenue', 'sum'),
        profit=('profit', 'sum')
    ).reset_index()
    discount_impact['margin_pct'] = (discount_impact['profit'] / discount_impact['revenue'] * 100).round(2)
    
    # Declining products: Compare Q3 vs Q4 revenue
    df['quarter'] = df['order_date'].dt.to_period('Q').astype(str)
    q_sales = df[df['quarter'].isin(['2024Q3', '2024Q4'])].groupby(['product_name', 'quarter'])['revenue'].sum().unstack(fill_value=0)
    if '2024Q3' in q_sales.columns and '2024Q4' in q_sales.columns:
        q_sales['growth_pct'] = ((q_sales['2024Q4'] - q_sales['2024Q3']) / q_sales['2024Q3'] * 100).round(2)
        declining = q_sales[q_sales['growth_pct'] < 0].sort_values('growth_pct')
    else:
        declining = pd.DataFrame()
        
    return {
        'top_revenue_products': top_revenue,
        'top_profit_products': top_profit,
        'lowest_margin_products': lowest_margin,
        'discount_impact': discount_impact,
        'declining_products': declining.reset_index().to_dict(orient='records')
    }

if __name__ == '__main__':
    from data_cleaning import clean_orders_data
    df = clean_orders_data()
    res = analyze_products(df)
    print("Top Revenue Product:", res['top_revenue_products'].iloc[0]['product_name'])
