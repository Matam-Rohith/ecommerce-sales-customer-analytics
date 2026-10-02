import React from 'react';
import { KPIData, MonthlyTrend, CategoryData, CityData, CustomerSegmentSummary, BusinessInsight } from '../services/api';
import { KPICard } from '../components/KPICard';
import { RevenueChart } from '../components/RevenueChart';
import { ProductTable } from '../components/ProductTable';
import { 
  IndianRupee, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Percent, 
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DashboardProps {
  kpis: KPIData;
  monthlyTrend: MonthlyTrend[];
  categories: CategoryData[];
  cities: CityData[];
  rfm: CustomerSegmentSummary;
  topProducts: any[];
  insights: BusinessInsight[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  kpis,
  monthlyTrend,
  categories,
  cities,
  rfm,
  topProducts,
  insights,
  onNavigate
}) => {
  // Monthly Chart Data
  const monthlyChartData = {
    labels: monthlyTrend.map(m => m.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyTrend.map(m => m.revenue),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        fill: true,
        tension: 0.35,
        type: 'line' as const
      },
      {
        label: 'Profit',
        data: monthlyTrend.map(m => m.profit),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        type: 'line' as const
      }
    ]
  };

  // Category Chart Data
  const categoryChartData = {
    labels: categories.map(c => c.category),
    datasets: [
      {
        label: 'Revenue',
        data: categories.map(c => c.revenue),
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'],
        borderRadius: 6
      }
    ]
  };

  // City Chart Data
  const cityChartData = {
    labels: cities.slice(0, 7).map(c => c.city),
    datasets: [
      {
        label: 'Revenue',
        data: cities.slice(0, 7).map(c => c.revenue),
        backgroundColor: '#06b6d4',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Executive Command Center
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                · Fiscal Year 2024
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              RETAILIQ ANALYTICS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-dimensional business analytics: 1,800 validated orders across 10 Indian metropolitan cities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('insights')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Business Insights</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KPICard
          title="Total Revenue"
          value={`₹${(kpis.total_revenue / 100000).toFixed(2)}L`}
          subtext="Net sales after discounts"
          icon={IndianRupee}
          color="blue"
          badge={{ text: `${kpis.mom_growth_pct > 0 ? '+' : ''}${kpis.mom_growth_pct}% MoM`, type: kpis.mom_growth_pct >= 0 ? 'positive' : 'negative' }}
        />
        <KPICard
          title="Total Profit"
          value={`₹${(kpis.total_profit / 100000).toFixed(2)}L`}
          subtext="Gross earnings"
          icon={TrendingUp}
          color="emerald"
          badge={{ text: `${kpis.profit_margin_pct}% Margin`, type: 'positive' }}
        />
        <KPICard
          title="Profit Margin"
          value={`${kpis.profit_margin_pct}%`}
          subtext="Healthy gross yield"
          icon={Percent}
          color="amber"
          badge={{ text: 'Strong', type: 'positive' }}
        />
        <KPICard
          title="Total Orders"
          value={kpis.total_orders.toLocaleString()}
          subtext={`${kpis.total_items_sold.toLocaleString()} units shipped`}
          icon={ShoppingBag}
          color="purple"
          badge={{ text: '100% Fulfilled', type: 'info' }}
        />
        <KPICard
          title="Active Customers"
          value={kpis.unique_customers.toLocaleString()}
          subtext={`${rfm.repeat_purchase_rate_pct}% repeat rate`}
          icon={Users}
          color="cyan"
          badge={{ text: `${rfm.segment_counts.Champions || 0} Champions`, type: 'positive' }}
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${kpis.avg_order_value.toLocaleString()}`}
          subtext="Revenue per order"
          icon={CreditCard}
          color="rose"
          badge={{ text: 'Standard', type: 'neutral' }}
        />
      </div>

      {/* Monthly Revenue vs Profit Trend (Full Width) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>📈 Monthly Revenue vs Profit Trend</span>
              <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                12-Month Progression
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tracking top-line revenue against bottom-line gross profit with continuous margin realization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('sales')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition cursor-pointer"
          >
            <span>View 3-Month Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <RevenueChart data={monthlyChartData} height={290} />
      </div>

      {/* Category Breakdown & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              🗂 Revenue by Product Category
            </h3>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              Category Details →
            </button>
          </div>
          <RevenueChart data={categoryChartData} type="bar" height={240} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              🌆 Revenue by Top Indian Cities
            </h3>
            <button
              onClick={() => onNavigate('regions')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              All Hubs →
            </button>
          </div>
          <RevenueChart data={cityChartData} type="bar" height={240} />
        </div>
      </div>

      {/* Top Products Table & Customer Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ProductTable products={topProducts} title="🏆 Top Products by Revenue" limit={6} />
        </div>

        {/* Customer RFM Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                👥 Customer RFM Health
              </h3>
              <button
                onClick={() => onNavigate('customers')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                View RFM →
              </button>
            </div>

            <div className="space-y-2.5">
              {Object.entries(rfm.segment_counts).map(([segName, count]) => {
                const total = rfm.total_customers || 1;
                const pct = ((count / total) * 100).toFixed(0);
                const color = 
                  segName === 'Champions' ? 'bg-emerald-500' :
                  segName === 'Loyal' ? 'bg-blue-500' :
                  segName === 'Potential Loyalists' ? 'bg-amber-500' :
                  segName === 'At Risk' ? 'bg-rose-500' : 'bg-slate-600';

                return (
                  <div key={segName} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{segName}</span>
                      <span className="font-bold text-white">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Repeat Buyer Rate</span>
            <span className="font-bold text-emerald-400">{rfm.repeat_purchase_rate_pct}%</span>
          </div>
        </div>
      </div>

      {/* AI Business Insights Banner (as shown in user mockup) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Business Insights (Verified Analytical Layer)
            </h3>
          </div>
          <button
            onClick={() => onNavigate('insights')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Explore Complete Briefing →
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.slice(0, 3).map((ins) => (
            <div key={ins.id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {ins.title}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {ins.finding}
                </p>
                <div className="mt-2 text-[10px] text-blue-400 font-semibold">
                  Action: {ins.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
