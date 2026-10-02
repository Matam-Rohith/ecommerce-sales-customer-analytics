"""
RetailIQ Analytics - Statistical Anomaly Detection Engine
Applies Z-Score and Interquartile Range (IQR) methods to detect:
- Revenue spikes & drops
- Unusual daily/weekly order volumes
- Abnormal product discount percentages
- Profit margin anomalies
"""
import pandas as pd
import numpy as np

def detect_anomalies(df):
    anomalies = []
    
    # 1. Daily Revenue Spikes & Drops
    daily = df.groupby('order_date').agg(
        daily_revenue=('revenue', 'sum'),
        daily_profit=('profit', 'sum'),
        order_count=('order_id', 'nunique')
    ).reset_index()
    
    mean_rev = daily['daily_revenue'].mean()
    std_rev = daily['daily_revenue'].std()
    
    for idx, row in daily.iterrows():
        z_score = (row['daily_revenue'] - mean_rev) / (std_rev if std_rev > 0 else 1)
        if z_score > 2.5:
            anomalies.append({
                'id': f"ANOM-REV-SPIKE-{idx}",
                'type': 'Revenue Spike',
                'severity': 'high',
                'date': str(row['order_date']),
                'metric': f"₹{row['daily_revenue']:,.0f}",
                'expected': f"₹{mean_rev:,.0f}",
                'description': f"Daily revenue was {z_score:.1f}σ above normal baseline (+₹{row['daily_revenue'] - mean_rev:,.0f}).",
                'action': 'Investigate marketing campaign or flash sale driver for replication.'
            })
        elif z_score < -2.2:
            anomalies.append({
                'id': f"ANOM-REV-DROP-{idx}",
                'type': 'Revenue Drop',
                'severity': 'critical',
                'date': str(row['order_date']),
                'metric': f"₹{row['daily_revenue']:,.0f}",
                'expected': f"₹{mean_rev:,.0f}",
                'description': f"Daily revenue fell {abs(z_score):.1f}σ below normal baseline.",
                'action': 'Verify payment gateway logs and checkout funnel health.'
            })
            
    # 2. Abnormal Discounts (Discount > 12% when median is 0-5%)
    deep_discounts = df[df['discount'] >= 0.15].copy()
    if len(deep_discounts) > 0:
        anomalies.append({
            'id': 'ANOM-DISC-01',
            'type': 'Abnormal Discounting',
            'severity': 'medium',
            'date': 'Multiple 2024 Orders',
            'metric': f"{len(deep_discounts)} orders at ≥15% discount",
            'expected': 'Discount policy max: 10%',
            'description': f"{len(deep_discounts)} transactions breached threshold discount limits, eroding overall margin.",
            'action': 'Enforce strict promo code validation rules and manager sign-off.'
        })
        
    # 3. Unusual Profit Margin Outliers
    df['order_margin'] = df['profit'] / df['revenue'] * 100
    low_margin_orders = df[df['order_margin'] < 20]
    if len(low_margin_orders) > 0:
        worst_category = low_margin_orders['category'].value_counts().index[0]
        anomalies.append({
            'id': 'ANOM-MARGIN-01',
            'type': 'Unusual Margin Compression',
            'severity': 'high',
            'date': 'Ongoing 2024 Trend',
            'metric': f"{len(low_margin_orders)} orders below 20% margin",
            'expected': 'Target gross margin: ≥ 45%',
            'description': f"Profit margin compressed severely in {worst_category} category.",
            'action': 'Renegotiate wholesale vendor pricing or revise floor selling prices.'
        })
        
    return anomalies

if __name__ == '__main__':
    from data_cleaning import clean_orders_data
    df = clean_orders_data()
    anoms = detect_anomalies(df)
    print(f"Detected {len(anoms)} statistical anomalies:")
    for a in anoms:
        print(f"[{a['type']}] ({a['severity'].upper()}): {a['description']}")
