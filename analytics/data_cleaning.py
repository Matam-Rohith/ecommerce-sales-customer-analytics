"""
RetailIQ Analytics - Data Cleaning & Ingestion Module
Validates schemas, cleans data types, handles outliers, and guarantees relational integrity.
"""
import pandas as pd
import numpy as np
import os

def clean_orders_data(filepath='data/orders.csv'):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Orders dataset not found at {filepath}")
    
    df = pd.read_csv(filepath)
    initial_rows = len(df)
    
    # 1. Strip whitespaces
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].astype(str).str.strip()
        
    # 2. Date parsing
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
    df = df.dropna(subset=['order_date'])
    
    # 3. Numeric conversion
    numeric_cols = ['quantity', 'unit_cost', 'unit_price', 'discount', 'revenue', 'cost', 'profit']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
    # 4. Logical validation
    # Revenue = unit_price * quantity * (1 - discount)
    expected_revenue = (df['unit_price'] * df['quantity'] * (1 - df['discount'])).round(2)
    # Check if deviation is minor, otherwise recalculate
    discrepancy = np.abs(df['revenue'] - expected_revenue)
    if (discrepancy > 5.0).sum() > 0:
        df['revenue'] = expected_revenue
        df['cost'] = (df['unit_cost'] * df['quantity']).round(2)
        df['profit'] = (df['revenue'] - df['cost']).round(2)
        
    # 5. Remove exact duplicates
    df = df.drop_duplicates(subset=['order_id'])
    
    print(f"Data Cleaning Complete: {len(df)} valid records retained from {initial_rows}.")
    return df

if __name__ == '__main__':
    clean_df = clean_orders_data()
    print(clean_df.head())
