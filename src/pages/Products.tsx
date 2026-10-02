import React, { useState } from 'react';
import { ProductTable } from '../components/ProductTable';
import { RevenueChart } from '../components/RevenueChart';
import { 
  Package, 
  TrendingDown, 
  Percent, 
  DollarSign, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ProductsProps {
  productIntel: any;
}

export const Products: React.FC<ProductsProps> = ({ productIntel }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'revenue' | 'profit' | 'margin' | 'discount'>('all');

  const topRev = productIntel?.top_by_revenue || [];
  const topProf = productIntel?.top_by_profit || [];
  const lowestMargin = productIntel?.lowest_margin || [];
  const declining = productIntel?.declining_products || [];
  const discountTiers = productIntel?.discount_impact || [];

  // Chart data for Discount vs Profit Margin
  const discountChartData = {
    labels: discountTiers.map((d: any) => d.tier),
    datasets: [
      {
        label: 'Gross Profit Margin %',
        data: discountTiers.map((d: any) => d.margin_pct),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📦 Product Intelligence & Profitability Dynamics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unit economics, discount sensitivity vs profit margin erosion, and catalog health.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeSubTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('discount')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeSubTab === 'discount' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discount vs Margin
          </button>
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeSubTab === 'revenue' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Revenue
          </button>
          <button
            onClick={() => setActiveSubTab('profit')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeSubTab === 'profit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Profit
          </button>
        </div>
      </div>

      {/* Discount vs Margin Impact Section (Crucial Business Question) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Discount Elasticity vs. Profit Margin Impact
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Evaluating the business thesis: <em>Does aggressive discounting produce unsustainable margin compression?</em>
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Heavy discounts reduce margin by ~18%</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <RevenueChart data={discountChartData} type="bar" height={220} formatAsLakhs={false} />
          </div>

          <div className="space-y-3">
            {discountTiers.map((tier: any) => (
              <div key={tier.tier} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{tier.tier}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Revenue: ₹{(tier.revenue / 100000).toFixed(2)}L · Profit: ₹{(tier.profit / 100000).toFixed(2)}L
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    tier.margin_pct >= 50 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    tier.margin_pct >= 40 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    tier.margin_pct >= 30 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {tier.margin_pct}% Margin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Declining Products Alert Section */}
      {declining.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Declining Products Watchlist (Second Half Revenue Contraction)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {declining.slice(0, 4).map((dec: any) => (
              <div key={dec.product_name} className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{dec.product_name}</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/30">
                    {dec.growth_pct}%
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>H1: ₹{(dec.h1_revenue / 100000).toFixed(1)}L</span>
                  <span>H2: ₹{(dec.h2_revenue / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tables View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTable products={topRev} title="🏆 Top Products by Net Revenue" limit={8} />
        <ProductTable products={topProf} title="💰 Top Products by Absolute Gross Profit" limit={8} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProductTable products={lowestMargin} title="⚠ Lowest Margin Products (Margin Dilution Risks)" limit={6} />
      </div>
    </div>
  );
};
