import React from 'react';
import { CohortRow } from '../services/api';

interface CohortMatrixProps {
  cohorts: CohortRow[];
}

export const CohortMatrix: React.FC<CohortMatrixProps> = ({ cohorts }) => {
  const getRetentionColor = (pct: number) => {
    if (pct === 100) return 'bg-blue-600 text-white font-bold';
    if (pct >= 60) return 'bg-blue-500/80 text-white font-semibold';
    if (pct >= 40) return 'bg-blue-600/50 text-blue-200';
    if (pct >= 25) return 'bg-blue-800/40 text-blue-300';
    if (pct > 0) return 'bg-slate-800/80 text-slate-400';
    return 'bg-slate-900/40 text-slate-600';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Customer Cohort Retention Matrix (Month-over-Month)
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">
          Percentage of customers acquired in each cohort month who made repeat purchases in subsequent months.
        </p>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full text-center text-xs">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase font-semibold">
              <th className="text-left pb-3 px-2">Cohort Month</th>
              <th className="text-center pb-3 px-2">Customers</th>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className="pb-3 px-1.5 text-center">
                  M+{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {cohorts.map((c) => (
              <tr key={c.cohort} className="hover:bg-slate-800/30 transition">
                <td className="text-left py-2 px-2 font-bold text-slate-300 whitespace-nowrap">
                  {c.cohort}
                </td>
                <td className="text-center py-2 px-2 font-medium text-slate-400">
                  {c.cohort_size}
                </td>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const mData = c.retention.find(r => r.month_index === idx);
                  if (!mData) {
                    return (
                      <td key={idx} className="p-1">
                        <div className="w-10 h-7 mx-auto rounded flex items-center justify-center text-[10px] bg-slate-950/30 text-slate-700">
                          -
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={idx} className="p-1">
                      <div
                        className={`w-10 h-7 mx-auto rounded flex items-center justify-center text-[10px] transition ${getRetentionColor(
                          mData.retention_pct
                        )}`}
                        title={`${c.cohort} M+${idx}: ${mData.active_count}/${c.cohort_size} active (${mData.retention_pct}%)`}
                      >
                        {mData.retention_pct}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
