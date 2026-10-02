export interface FilterState {
  startDate?: string;
  endDate?: string;
  city?: string;
  category?: string;
  segment?: string;
  product?: string;
}

export interface KPIData {
  total_revenue: number;
  total_profit: number;
  profit_margin_pct: number;
  total_orders: number;
  unique_customers: number;
  avg_order_value: number;
  mom_growth_pct: number;
  total_items_sold: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  profit: number;
  order_count: number;
  margin_pct: number;
}

export interface CategoryData {
  category: string;
  revenue: number;
  profit: number;
  units_sold: number;
  orders_count: number;
  margin_pct: number;
}

export interface CityData {
  city: string;
  revenue: number;
  profit: number;
  orders_count: number;
  customer_count: number;
  margin_pct: number;
}

export interface ForecastPoint {
  month: string;
  actual_revenue: number | null;
  actual_profit: number | null;
  forecast: number;
  lower_ci: number | null;
  upper_ci: number | null;
  is_forecast: boolean;
}

export interface ForecastResponse {
  history: ForecastPoint[];
  forecast: ForecastPoint[];
  methodology: string;
}

export interface CustomerSegmentSummary {
  segment_counts: Record<string, number>;
  total_customers: number;
  repeat_customers: number;
  repeat_purchase_rate_pct: number;
  avg_customer_lifetime_value: number;
  churn_risk_count: number;
}

export interface CustomerItem {
  customer_id: string;
  customer_name: string;
  city: string;
  frequency: number;
  monetary: number;
  profit: number;
  recency_days: number;
  r_score: number;
  f_score: number;
  m_score: number;
  rfm_segment: string;
  aov: number;
  margin_pct: number;
  estimated_clv: number;
  churn_risk: boolean;
}

export interface CohortRow {
  cohort: string;
  cohort_size: number;
  retention: Array<{
    month_index: number;
    month_label: string;
    active_count: number;
    retention_pct: number;
  }>;
}

export interface AnomalyItem {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  metric: string;
  expected: string;
  description: string;
  action: string;
}

export interface BusinessInsight {
  id: string;
  type: 'warning' | 'positive' | 'alert' | 'trend';
  title: string;
  stat: string;
  finding: string;
  recommendation: string;
}

function buildQuery(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.city && filters.city !== 'All') params.append('city', filters.city);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.segment && filters.segment !== 'All') params.append('segment', filters.segment);
  if (filters.product && filters.product !== 'All') params.append('product', filters.product);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const api = {
  async getKPIs(filters: FilterState = {}): Promise<KPIData> {
    const res = await fetch(`/api/dashboard/kpis${buildQuery(filters)}`);
    return res.json();
  },

  async getSalesTrend(filters: FilterState = {}): Promise<MonthlyTrend[]> {
    const res = await fetch(`/api/sales/trend${buildQuery(filters)}`);
    return res.json();
  },

  async getCategories(filters: FilterState = {}): Promise<CategoryData[]> {
    const res = await fetch(`/api/sales/by-category${buildQuery(filters)}`);
    return res.json();
  },

  async getRegions(filters: FilterState = {}): Promise<CityData[]> {
    const res = await fetch(`/api/regions${buildQuery(filters)}`);
    return res.json();
  },

  async getTopProducts(filters: FilterState = {}): Promise<any[]> {
    const res = await fetch(`/api/products/top${buildQuery(filters)}`);
    return res.json();
  },

  async getProductIntelligence(filters: FilterState = {}): Promise<any> {
    const res = await fetch(`/api/products/intelligence${buildQuery(filters)}`);
    return res.json();
  },

  async getCustomerSegments(filters: FilterState = {}): Promise<CustomerSegmentSummary> {
    const res = await fetch(`/api/customers/segments${buildQuery(filters)}`);
    return res.json();
  },

  async getTopCustomers(): Promise<CustomerItem[]> {
    const res = await fetch(`/api/customers/top`);
    return res.json();
  },

  async getCohorts(): Promise<CohortRow[]> {
    const res = await fetch(`/api/customers/cohorts`);
    return res.json();
  },

  async getForecast(): Promise<ForecastResponse> {
    const res = await fetch(`/api/sales/forecast`);
    return res.json();
  },

  async getAnomalies(): Promise<AnomalyItem[]> {
    const res = await fetch(`/api/anomalies`);
    return res.json();
  },

  async getInsights(): Promise<BusinessInsight[]> {
    const res = await fetch(`/api/insights`);
    return res.json();
  },

  async generateAiInsights(): Promise<{ source: string; narrative: string }> {
    const res = await fetch(`/api/insights/generate-ai`, { method: 'POST' });
    return res.json();
  },

  async uploadData(fileOrCsv: File | string, processNow = false): Promise<any> {
    if (typeof fileOrCsv === 'string') {
      const res = await fetch(`/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: fileOrCsv, processNow: String(processNow) })
      });
      return res.json();
    } else {
      const formData = new FormData();
      formData.append('file', fileOrCsv);
      formData.append('processNow', String(processNow));
      const res = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData
      });
      return res.json();
    }
  },

  async login(email: string, password?: string): Promise<any> {
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
};
