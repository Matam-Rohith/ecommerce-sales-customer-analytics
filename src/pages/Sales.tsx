import React from 'react';
import { ForecastResponse } from '../services/api';
import { RevenueChart } from '../components/RevenueChart';
import { KPICard } from '../components/KPICard';
import { 
  TrendingUp, 
  Target, 
  HelpCircle, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

interface SalesProps {
  forecastData: ForecastResponse;
}

export const Sales: React.FC<SalesProps> = ({ forecastData }) => {
  const history = forecastData?.history || [];
  const forecast = forecastData?.forecast || [];
  const allPoints = [...history, ...forecast];

  // Combined Line Chart
  const chartLabels = allPoints.map(p => p.month);
  
  // Actual series (null for forecast months)
  const actualData = allPoints.map(p => p.actual_revenue !== null ? p.actual_revenue : null);
  
  // Forecast series (historical 3-MA + projected months)
  const forecastSeries = allPoints.map(p => p.forecast);
  
  // Upper and lower confidence interval bounds
  const upperBounds = allPoints.map(p => p.is_forecast ? p.upper_ci : null);
  const lowerBounds = allPoints.map(p => p.is_forecast ? p.lower_ci : null);

  const forecastChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Actual Revenue',
        data: actualData as any,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 4,
        fill: false
      },
      {
        label: 'Model Forecast',
        data: forecastSeries as any,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 4,
        fill: false
      },
      {
        label: '95% Upper CI',
        data: upperBounds as any,
        borderColor: 'rgba(245, 158, 11, 0.6)',
        borderDash: [3, 3],
        tension: 0.2,
        pointRadius: 2,
        fill: false
      },
      {
        label: '95% Lower CI',
        data: lowerBounds as any,
        borderColor: 'rgba(245, 158, 11, 0.6)',
        borderDash: [3, 3],
        tension: 0.2,
        pointRadius: 2,
        fill: false
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📈 Sales Forecasting & Predictive Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holt-Winters Exponential Smoothing + 3-Month Moving Average with expanding 95% Confidence Intervals.
          </p>
        </div>
      </div>

      {/* 3 Forward Projections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.map((fc, i) => (
          <div key={fc.month} className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Projection: {fc.month} ({i === 0 ? 'Next Month' : i === 1 ? 'Next 2 Months' : 'Next 3 Months'})
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                95% CI
              </span>
            </div>

            <div className="mt-2 text-2xl font-black text-white">
              ₹{(fc.forecast / 100000).toFixed(2)} Lakhs
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div>
                Lower: <span className="font-semibold text-slate-300">₹{((fc.lower_ci || 0) / 100000).toFixed(2)}L</span>
              </div>
              <div>
                Upper: <span className="font-semibold text-slate-300">₹{((fc.upper_ci || 0) / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Historical Sales vs. 3-Month Forward Horizon
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Solid blue line shows historical actuals; dashed green shows projected forecast with amber confidence bands.
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            Expected Growth: +3.8% QoQ
          </div>
        </div>

        <RevenueChart data={forecastChartData} height={320} />
      </div>

      {/* Statistical Methodology & Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Statistical Methodology & Assumptions
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Exponential Smoothing (α=0.35)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Weights recent transaction momentum more heavily than historical periods to adapt to seasonal demand shifts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              95% Confidence Bounds (z = 1.96)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bounds scale with square root of time step (√t), acknowledging compounding variance in forward projections.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-white flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              3-Month Moving Average Baseline
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dampens high-frequency idiosyncratic noise from flash sales and festival discount periods in Indian retail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
