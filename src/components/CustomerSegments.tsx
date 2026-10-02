import React from 'react';
import { CustomerSegmentSummary } from '../services/api';
import { Crown, Heart, Sparkles, AlertOctagon, UserX } from 'lucide-react';

interface CustomerSegmentsProps {
  data: CustomerSegmentSummary;
  onSelectSegment?: (segment: string) => void;
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ data, onSelectSegment }) => {
  const segments = [
    {
      name: 'Champions',
      count: data.segment_counts['Champions'] || 0,
      icon: Crown,
      color: 'emerald',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300',
      desc: 'Bought recently, buy often, and spend the most. Prime brand advocates.'
    },
    {
      name: 'Loyal',
      count: data.segment_counts['Loyal'] || 0,
      icon: Heart,
      color: 'blue',
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300',
      desc: 'Consistently buy across multiple months with steady high order value.'
    },
    {
      name: 'Potential Loyalists',
      count: data.segment_counts['Potential Loyalists'] || 0,
      icon: Sparkles,
      color: 'amber',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300',
      desc: 'Recent customers with average frequency. Ready for cross-sell recommendations.'
    },
    {
      name: 'At Risk',
      count: data.segment_counts['At Risk'] || 0,
      icon: AlertOctagon,
      color: 'rose',
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300',
      desc: 'Purchased frequently in past, but zero transactions in over 90 days.'
    },
    {
      name: 'Lost',
      count: data.segment_counts['Lost'] || 0,
      icon: UserX,
      color: 'slate',
      bg: 'bg-slate-800/40 border-slate-700 text-slate-400',
      badge: 'bg-slate-700 text-slate-300',
      desc: 'Lowest recency, frequency, and spend scores. Highly dormant accounts.'
    }
  ];

  const total = data.total_customers || 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {segments.map(seg => {
        const Icon = seg.icon;
        const pct = ((seg.count / total) * 100).toFixed(1);
        return (
          <div
            key={seg.name}
            onClick={() => onSelectSegment && onSelectSegment(seg.name)}
            className={`border rounded-xl p-4 transition-all duration-150 cursor-pointer hover:scale-[1.02] ${seg.bg}`}
          >
            <div className="flex items-center justify-between">
              <Icon className="w-5 h-5" />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${seg.badge}`}>
                {pct}% Share
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-black text-white">
                {seg.count}
              </div>
              <div className="text-xs font-bold tracking-wide uppercase mt-0.5">
                {seg.name}
              </div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              {seg.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
