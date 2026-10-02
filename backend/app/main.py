"""
RetailIQ Analytics Platform - FastAPI Backend Application
Provides high-performance REST APIs for business intelligence, RFM, forecasting, and data ingestion.
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.routes import dashboard, customers, products, sales, regions, insights, upload

app = FastAPI(
    title="RetailIQ Analytics API",
    description="Enterprise REST API for E-Commerce Sales, RFM Segmentation, Profitability, and Machine Learning Forecasting.",
    version="2.0.0"
)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Executive Dashboard"])
app.include_router(sales.router, prefix="/api/sales", tags=["Sales & Forecasting"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customer Intelligence"])
app.include_router(products.router, prefix="/api/products", tags=["Product Intelligence"])
app.include_router(regions.router, prefix="/api/regions", tags=["Regional Performance"])
app.include_router(insights.router, prefix="/api/insights", tags=["AI Business Insights"])
app.include_router(upload.router, prefix="/api/upload", tags=["Data Upload & ETL"])

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RetailIQ Backend API",
        "version": "2.0.0",
        "database": "PostgreSQL Connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
