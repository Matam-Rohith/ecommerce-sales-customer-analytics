"""
RetailIQ Analytics - RFM Segmentation Engine
Calculates Recency, Frequency, Monetary (RFM) quintiles and segments customers.
"""
import pandas as pd
import numpy as np

def run_rfm_segmentation(df, reference_date=None):
    if reference_date is None:
        reference_date = df['order_date'].max() + pd.Timedelta(days=1)
    else:
        reference_date = pd.to_datetime(reference_date)
        
    rfm = df.groupby(['customer_id', 'customer_name', 'city'], as_index=False).agg(
        recency=('order_date', lambda x: (reference_date - x.max()).days),
        frequency=('order_id', 'nunique'),
        monetary=('revenue', 'sum'),
        profit=('profit', 'sum')
    )
    
    # 5-Quintile ranking (1 to 5)
    rfm['r_score'] = pd.qcut(rfm['recency'].rank(method='first', ascending=False), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first', ascending=True), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    rfm['m_score'] = pd.qcut(rfm['monetary'].rank(method='first', ascending=True), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    
    def assign_segment(row):
        r, f, m = row['r_score'], row['f_score'], row['m_score']
        if r >= 4 and f >= 4 and m >= 4:
            return 'Champions'
        elif r >= 3 and f >= 3:
            return 'Loyal'
        elif r >= 4 and f <= 2:
            return 'Potential Loyalists'
        elif r <= 2 and f >= 3:
            return 'At Risk'
        else:
            return 'Lost'
            
    rfm['segment'] = rfm.apply(assign_segment, axis=1)
    rfm['aov'] = (rfm['monetary'] / rfm['frequency']).round(2)
    rfm['margin_pct'] = (rfm['profit'] / rfm['monetary'] * 100).round(2)
    
    return rfm

if __name__ == '__main__':
    from data_cleaning import clean_orders_data
    df = clean_orders_data()
    rfm = run_rfm_segmentation(df)
    print(rfm['segment'].value_counts())
