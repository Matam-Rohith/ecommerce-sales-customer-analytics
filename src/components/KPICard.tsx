import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    type: 'positive' | 'negative' | 'neutral' | 'info';
  };
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  badge,
  icon: Icon,
  color = 'blue'
}) => {
  const colorMap = {
    blue: 'border-blue-500/30 bg-blue-950/20 text-blue-400 group-hover:border-blue-500/60',
    emerald: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 group-hover:border-emerald-500/60',
    amber: 'border-amber-500/30 bg-amber-950/20 text-amber-400 group-hover:border-amber-500/60',
    purple: 'border-purple-500/30 bg-purple-950/20 text-purple-400 group-hover:border-purple-500/60',
    cyan: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400 group-hover:border-cyan-500/60',
    rose: 'border-rose-500/30 bg-rose-950/20 text-rose-400 group-hover:border-rose-500/60',
  };

  const badgeColor = {
    positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    negative: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition-all duration-200 shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            {title}
          </span>
          <div className="mt-1 text-2xl font-black text-white tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border transition-colors ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        {subtext ? (
          <span className="text-[11px] text-slate-400 truncate font-medium">
            {subtext}
          </span>
        ) : <span />}

        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor[badge.type]}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};
