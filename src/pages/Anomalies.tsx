import React from 'react';
import { AnomalyItem } from '../services/api';
import { AnomalyAlerts } from '../components/AnomalyAlerts';
import { AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

interface AnomaliesProps {
  anomalies: AnomalyItem[];
}

export const Anomalies: React.FC<AnomaliesProps> = ({ anomalies }) => {
  const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
  const highCount = anomalies.filter(a => a.severity === 'high').length;
  const mediumCount = anomalies.filter(a => a.severity === 'medium').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>⚠ Automated Statistical Anomaly Detection Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Z-score and Interquartile Range (IQR) monitoring on transaction volumes, discount breaches, and margin drops.
          </p>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Anomalies</span>
          <span className="text-2xl font-black text-white mt-1 block">{anomalies.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Critical Severity</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">{criticalCount}</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">High Priority</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{highCount}</span>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Medium Notice</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{mediumCount}</span>
        </div>
      </div>

      {/* Anomaly Detection Alerts List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Flagged Statistical Outliers & Operational Breaches
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time heuristic evaluation
          </span>
        </div>

        <AnomalyAlerts anomalies={anomalies} />
      </div>

      {/* Operational Protocol Note */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Statistical Boundary Parameters:</strong> Daily sales outliers are triggered when daily revenue deviates beyond ±2.2 standard deviations (σ) from the rolling 30-day baseline mean. Discount policy alerts trigger on single transactions exceeding 12% promotional reduction.
        </p>
      </div>
    </div>
  );
};
