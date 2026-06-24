import pandas as pd
import numpy as np

orders = pd.read_csv('../data/orders.csv', parse_dates=['order_date'])
orders['order_month'] = orders['order_date'].dt.to_period('M').astype(str)

total_revenue = orders['revenue'].sum()
total_profit  = orders['profit'].sum()
total_orders  = orders['order_id'].nunique()
aov           = total_revenue / total_orders
margin_pct    = round(total_profit / total_revenue * 100, 2)

print(f'Revenue : {total_revenue:,.0f}')
print(f'Profit  : {total_profit:,.0f}')
print(f'Margin  : {margin_pct}%')
print(f'Orders  : {total_orders}')
print(f'AOV     : {aov:,.0f}')

top_products = orders.groupby(['product_name','category'], as_index=False).agg(
    total_revenue=('revenue','sum'), total_profit=('profit','sum'),
    units_sold=('quantity','sum')).sort_values('total_revenue', ascending=False)
print('\nTop Products:'); print(top_products.head(10).to_string(index=False))

top_customers = orders.groupby(['customer_id','customer_name'], as_index=False).agg(
    lifetime_revenue=('revenue','sum'), lifetime_profit=('profit','sum'),
    total_orders=('order_id','nunique'), last_order=('order_date','max')
).sort_values('lifetime_revenue', ascending=False)
print('\nTop Customers:'); print(top_customers.head(10).to_string(index=False))

snapshot = orders['order_date'].max() + pd.Timedelta(days=1)
rfm = orders.groupby(['customer_id','customer_name'], as_index=False).agg(
    recency=('order_date', lambda x: (snapshot-x.max()).days),
    frequency=('order_id','nunique'), monetary=('revenue','sum'))
rfm['r'] = pd.qcut(rfm['recency'].rank(method='first',ascending=False),5,labels=[1,2,3,4,5]).astype(int)
rfm['f'] = pd.qcut(rfm['frequency'].rank(method='first'),5,labels=[1,2,3,4,5]).astype(int)
rfm['m'] = pd.qcut(rfm['monetary'].rank(method='first'),5,labels=[1,2,3,4,5]).astype(int)

def get_segment(row):
    if row.r>=4 and row.f>=4 and row.m>=4: return 'Champions'
    if row.r>=3 and row.f>=3:              return 'Loyal Customers'
    if row.r>=4 and row.f<=2:             return 'Potential Loyalists'
    if row.r<=2 and row.f>=3:             return 'At Risk'
    return 'Others'
rfm['segment'] = rfm.apply(get_segment, axis=1)
print('\nRFM:'); print(rfm['segment'].value_counts())

monthly = orders.groupby('order_month', as_index=False).agg(
    monthly_revenue=('revenue','sum'), monthly_profit=('profit','sum'),
    orders_count=('order_id','nunique'))
monthly['forecast_3ma'] = monthly['monthly_revenue'].rolling(3,min_periods=1).mean().shift(1)

category_profit = orders.groupby('category', as_index=False).agg(
    total_revenue=('revenue','sum'), total_profit=('profit','sum'))
category_profit['margin_pct'] = (category_profit['total_profit']/category_profit['total_revenue']*100).round(2)
print('\nCategory Profit:'); print(category_profit.to_string(index=False))

top_products.to_csv('../insights/top_products.csv', index=False)
top_customers.to_csv('../insights/top_customers.csv', index=False)
rfm.to_csv('../insights/rfm_segments.csv', index=False)
monthly.to_csv('../insights/monthly_sales_forecast.csv', index=False)
category_profit.to_csv('../insights/category_profitability.csv', index=False)
print('Done.')
