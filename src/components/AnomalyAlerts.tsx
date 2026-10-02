import React from 'react';
import { AnomalyItem } from '../services/api';
import { AlertTriangle, TrendingUp, TrendingDown, Percent, Zap } from 'lucide-react';

interface AnomalyAlertsProps {
  anomalies: AnomalyItem[];
}

export const AnomalyAlerts: React.FC<AnomalyAlertsProps> = ({ anomalies }) => {
  const getIcon = (type: string) => {
    if (type.includes('Spike')) return TrendingUp;
    if (type.includes('Drop')) return TrendingDown;
    if (type.includes('Discount')) return Percent;
    return AlertTriangle;
  };

  const severityStyles = {
    critical: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
    high: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    medium: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    low: 'border-slate-700 bg-slate-800/40 text-slate-300'
  };

  const badgeStyles = {
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    low: 'bg-slate-700 text-slate-300 border-slate-600'
  };

  return (
    <div className="space-y-3">
      {anomalies.map((anom) => {
        const Icon = getIcon(anom.type);
        return (
          <div
            key={anom.id}
            className={`border rounded-xl p-4 transition-all duration-150 ${severityStyles[anom.severity]}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    {anom.type}
                    <span className="text-[11px] text-slate-400 font-normal">
                      · {anom.date}
                    </span>
                  </h4>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Metric: <span className="font-semibold text-white">{anom.metric}</span> | Expected: <span className="text-slate-400">{anom.expected}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badgeStyles[anom.severity]}`}>
                {anom.severity} Severity
              </span>
            </div>

            <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
              {anom.description}
            </p>

            {anom.action && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Recommended Action:</strong> {anom.action}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
