"""
RetailIQ Analytics - Master Analytics Pipeline Orchestrator
Executes data ingestion, RFM segmentation, customer intelligence,
product analysis, 3-month forecasting, and anomaly detection.
"""
import os
import json
import pandas as pd
from data_cleaning import clean_orders_data
from rfm_analysis import run_rfm_segmentation
from customer_analysis import analyze_customers
from product_analysis import analyze_products
from forecasting import generate_sales_forecast
from anomaly_detection import detect_anomalies

def run_master_pipeline(data_path='data/orders.csv', output_dir='insights'):
    os.makedirs(output_dir, exist_ok=True)
    print("=" * 60)
    print("STARTING RETAILIQ ANALYTICS PIPELINE")
    print("=" * 60)
    
    # 1. Cleaning
    df = clean_orders_data(data_path)
    
    # 2. RFM
    print("--> Computing RFM Segments...")
    rfm = run_rfm_segmentation(df)
    rfm.to_csv(os.path.join(output_dir, 'rfm_segments.csv'), index=False)
    
    # 3. Customer Intelligence
    print("--> Running Customer Intelligence & CLV...")
    cust_res = analyze_customers(df)
    cust_res['customer_profiles'].to_csv(os.path.join(output_dir, 'top_customers.csv'), index=False)
    
    # 4. Product Intelligence
    print("--> Running Product Intelligence & Discount Impact...")
    prod_res = analyze_products(df)
    prod_res['top_revenue_products'].to_csv(os.path.join(output_dir, 'top_products.csv'), index=False)
    
    # 5. Forecasting
    print("--> Generating 3-Month Sales Forecast with 95% CI...")
    fc_res = generate_sales_forecast(df)
    pd.DataFrame(fc_res['history'] + fc_res['forecast']).to_csv(os.path.join(output_dir, 'monthly_sales_forecast.csv'), index=False)
    
    # 6. Anomalies
    print("--> Detecting Statistical Outliers...")
    anomalies = detect_anomalies(df)
    with open(os.path.join(output_dir, 'anomalies.json'), 'w') as f:
        json.dump(anomalies, f, indent=2)
        
    print("=" * 60)
    print("PIPELINE COMPLETED SUCCESSFULLY! All insights generated.")
    print("=" * 60)

if __name__ == '__main__':
    run_master_pipeline()
