import React, { useState, useEffect } from 'react';
import { 
  api, 
  FilterState, 
  KPIData, 
  MonthlyTrend, 
  CategoryData, 
  CityData, 
  CustomerSegmentSummary, 
  CustomerItem, 
  CohortRow, 
  ForecastResponse, 
  AnomalyItem, 
  BusinessInsight 
} from './services/api';
import { Navbar } from './components/Navbar';
import { GlobalFilters } from './components/GlobalFilters';
import { AuthModal } from './components/AuthModal';

import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Regions } from './pages/Regions';
import { Anomalies } from './pages/Anomalies';
import { Insights } from './pages/Insights';
import { Upload } from './pages/Upload';
import { PowerBI } from './pages/PowerBI';
import { RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [filters, setFilters] = useState<FilterState>({});
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Matam Rohith',
    role: 'Admin',
    email: 'admin@retailiq.in'
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Data states
  const [kpis, setKpis] = useState<KPIData>({
    total_revenue: 0,
    total_profit: 0,
    profit_margin_pct: 0,
    total_orders: 0,
    unique_customers: 0,
    avg_order_value: 0,
    mom_growth_pct: 0,
    total_items_sold: 0
  });
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [productIntel, setProductIntel] = useState<any>(null);
  const [rfm, setRfm] = useState<CustomerSegmentSummary>({
    segment_counts: {},
    total_customers: 0,
    repeat_customers: 0,
    repeat_purchase_rate_pct: 0,
    avg_customer_lifetime_value: 0,
    churn_risk_count: 0
  });
  const [topCustomers, setTopCustomers] = useState<CustomerItem[]>([]);
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse>({ history: [], forecast: [], methodology: '' });
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);

  const loadData = async (activeFilters = filters) => {
    try {
      const [
        kpisRes,
        trendRes,
        catRes,
        cityRes,
        topProdRes,
        prodIntelRes,
        rfmRes,
        topCustRes,
        cohortsRes,
        forecastRes,
        anomRes,
        insRes
      ] = await Promise.all([
        api.getKPIs(activeFilters),
        api.getSalesTrend(activeFilters),
        api.getCategories(activeFilters),
        api.getRegions(activeFilters),
        api.getTopProducts(activeFilters),
        api.getProductIntelligence(activeFilters),
        api.getCustomerSegments(activeFilters),
        api.getTopCustomers(),
        api.getCohorts(),
        api.getForecast(),
        api.getAnomalies(),
        api.getInsights()
      ]);

      setKpis(kpisRes);
      setMonthlyTrend(trendRes);
      setCategories(catRes);
      setCities(cityRes);
      setTopProducts(topProdRes);
      setProductIntel(prodIntelRes);
      setRfm(rfmRes);
      setTopCustomers(topCustRes);
      setCohorts(cohortsRes);
      setForecast(forecastRes);
      setAnomalies(anomRes);
      setInsights(insRes);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        anomalyCount={anomalies.filter(a => a.severity === 'critical' || a.severity === 'high').length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Filters Bar */}
        <GlobalFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading RetailIQ Analytics...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                kpis={kpis}
                monthlyTrend={monthlyTrend}
                categories={categories}
                cities={cities}
                rfm={rfm}
                topProducts={topProducts}
                insights={insights}
                onNavigate={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'customers' && (
              <Customers
                rfm={rfm}
                topCustomers={topCustomers}
                cohorts={cohorts}
                onSelectSegmentFilter={(seg) => setFilters({ ...filters, segment: seg })}
              />
            )}

            {activeTab === 'products' && (
              <Products productIntel={productIntel} />
            )}

            {activeTab === 'sales' && (
              <Sales forecastData={forecast} />
            )}

            {activeTab === 'regions' && (
              <Regions cities={cities} />
            )}

            {activeTab === 'anomalies' && (
              <Anomalies anomalies={anomalies} />
            )}

            {activeTab === 'insights' && (
              <Insights insights={insights} />
            )}

            {activeTab === 'upload' && (
              <Upload onDataProcessed={() => loadData(filters)} />
            )}

            {activeTab === 'powerbi' && (
              <PowerBI />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong>RetailIQ</strong> · Full-Stack E-Commerce Sales & Customer Intelligence Platform
          </div>
          <div>
            Built by <a href="https://rohith-portfolio-six.vercel.app/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Matam Rohith</a> · 1,800 Orders · PostgreSQL + Python + React
          </div>
        </div>
      </footer>

      {/* Role / User Switcher Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => setCurrentUser(u)}
      />
    </div>
  );
};
export default App;
