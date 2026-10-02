from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FilterParams(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    city: Optional[str] = None
    category: Optional[str] = None
    segment: Optional[str] = None

class KPISummary(BaseModel):
    total_revenue: float
    total_profit: float
    profit_margin_pct: float
    total_orders: int
    unique_customers: int
    avg_order_value: float
    mom_growth_pct: float
    yoy_projected_growth_pct: float

class MonthlyTrendPoint(BaseModel):
    month: str
    revenue: float
    profit: float
    margin_pct: float
    order_count: int

class CategoryBreakdown(BaseModel):
    category: str
    revenue: float
    profit: float
    margin_pct: float
    units_sold: int

class CustomerProfile(BaseModel):
    customer_id: str
    customer_name: str
    city: str
    state: str
    rfm_segment: str
    recency_days: int
    frequency: int
    lifetime_revenue: float
    lifetime_profit: float
    estimated_clv: float
    churn_risk: bool

class ForecastPoint(BaseModel):
    month: str
    forecast: float
    lower_ci: float
    upper_ci: float
    is_forecast: bool
