import React from 'react';
import { BarChart3, Database, FileSpreadsheet, Layers, Download, CheckCircle, ExternalLink, Code } from 'lucide-react';

export const PowerBI: React.FC = () => {
  const pages = [
    {
      num: '01',
      title: 'Executive Overview',
      visuals: ['KPI Card Deck (Revenue, Profit, Margin %, AOV)', 'MoM Revenue vs Profit Area Chart with 3-Month MA', 'Category Profitability Matrix Slicer']
    },
    {
      num: '02',
      title: 'Customer Intelligence',
      visuals: ['RFM 5-Quintile Scatter Plot (Recency vs Frequency)', 'Monthly Customer Retention Cohort Heatmap', 'Top High-LTV Customer Tier Table']
    },
    {
      num: '03',
      title: 'Product & Profitability',
      visuals: ['Pareto 80/20 Revenue Cumulative Distribution', 'Discount Sensitivity vs Gross Margin Scatter', 'Declining Catalog Watchlist with QoQ Filters']
    },
    {
      num: '04',
      title: 'Regional Performance',
      visuals: ['India Metropolitan Geo-Map Bubble Density', 'City-Level Gross Yield Ranking', 'Southern vs Northern Hub Comparison']
    },
    {
      num: '05',
      title: 'Forecast & Trends',
      visuals: ['3-Month Projected Sales with 95% Confidence Interval', 'Decomposed Trend vs Seasonality Index', 'Quarterly Target Variance Analysis']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📊 Power BI Executive Enterprise Suite (Deliverable 13)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Star schema data model, 5-page report blueprint, DAX measures, and processed dimensional exports.
          </p>
        </div>
      </div>

      {/* Model Overview Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Star Schema Data Model
              </span>
              <span className="text-xs text-slate-400">
                Directly connects to processed dimensional tables in PostgreSQL / CSV
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              RetailIQ.pbix — Enterprise BI Reporting Architecture
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Designed specifically to showcase production BI modeling: 1:N star schema relationships with foreign key integrity, dynamic DAX measures, and role-based row-level security (RLS).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/40">
              5-Page Report Package
            </span>
          </div>
        </div>
      </div>

      {/* 5-Page Report Structure */}
      <div>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          5-Page Power BI Report Blueprint
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p) => (
            <div key={p.num} className="p-4.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-blue-400 font-mono">
                  PAGE {p.num}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                  Interactive View
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2">
                {p.title}
              </h4>

              <div className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-3">
                {p.visuals.map((v, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Model Card */}
          <div className="p-4.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="text-lg font-black text-amber-400 font-mono">
              DATA MODEL
            </span>
            <h4 className="text-sm font-bold text-white mt-2">
              Star Schema Entities
            </h4>
            <div className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span><code className="text-blue-300">dim_customers</code> (1:N)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span><code className="text-blue-300">dim_products</code> (1:N)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span><code className="text-emerald-300">fact_orders</code> (1:N)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span><code className="text-emerald-300">fact_order_items</code> (Grain: Line item)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span><code className="text-cyan-300">fact_payments</code> (1:1)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAX Measures Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Production DAX Measures (Stored in powerbi/DAX_Measures.dax)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Formulas optimized for VertiPaq engine
          </span>
        </div>

        <div className="bg-slate-950 font-mono text-xs text-slate-300 p-4 rounded-xl border border-slate-800 overflow-x-auto space-y-3">
          <div>
            <span className="text-slate-500">-- 1. Base Revenue & Margin</span>
            <div className="text-emerald-400">Total Revenue = SUM(fact_order_items[line_total])</div>
            <div className="text-emerald-400">Gross Margin % = DIVIDE([Total Revenue] - [Total Cost], [Total Revenue], 0)</div>
          </div>

          <div>
            <span className="text-slate-500">-- 2. Customer Lifetime Value (CLV)</span>
            <div className="text-blue-400">
              Estimated CLV = [Average Order Value] * [Purchase Frequency] * [Gross Margin %] * 1.6
            </div>
          </div>

          <div>
            <span className="text-slate-500">-- 3. Prior Month MoM Growth</span>
            <div className="text-amber-400">
              Revenue MoM Growth % = DIVIDE([Total Revenue] - CALCULATE([Total Revenue], DATEADD(fact_orders[order_date], -1, MONTH)), CALCULATE([Total Revenue], DATEADD(fact_orders[order_date], -1, MONTH)), 0)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
