import React, { useState } from 'react';
import { CustomerSegmentSummary, CustomerItem, CohortRow } from '../services/api';
import { CustomerSegments } from '../components/CustomerSegments';
import { CohortMatrix } from '../components/CohortMatrix';
import { KPICard } from '../components/KPICard';
import { 
  Users, 
  Repeat, 
  IndianRupee, 
  Award, 
  AlertTriangle, 
  Search, 
  ArrowUpDown,
  UserCheck
} from 'lucide-react';

interface CustomersProps {
  rfm: CustomerSegmentSummary;
  topCustomers: CustomerItem[];
  cohorts: CohortRow[];
  onSelectSegmentFilter: (segment: string) => void;
}

export const Customers: React.FC<CustomersProps> = ({
  rfm,
  topCustomers,
  cohorts,
  onSelectSegmentFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const filteredCustomers = topCustomers.filter(c => {
    const matchesSearch = c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'All' || c.rfm_segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>👥 Customer Intelligence & Behavioral RFM</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Recency, Frequency & Monetary segmentation, Customer Lifetime Value (CLV), and Cohort Retention.
          </p>
        </div>
      </div>

      {/* Customer Health KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KPICard
          title="Total Customers"
          value={rfm.total_customers.toLocaleString()}
          subtext="Unique buyer accounts"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Repeat Customers"
          value={rfm.repeat_customers.toLocaleString()}
          subtext="2+ purchases in 2024"
          icon={Repeat}
          color="emerald"
        />
        <KPICard
          title="Repeat Purchase Rate"
          value={`${rfm.repeat_purchase_rate_pct}%`}
          subtext="High retention baseline"
          icon={Award}
          color="purple"
          badge={{ text: 'Excellent', type: 'positive' }}
        />
        <KPICard
          title="Average CLV"
          value={`₹${rfm.avg_customer_lifetime_value.toLocaleString()}`}
          subtext="Projected forward LTV"
          icon={IndianRupee}
          color="cyan"
        />
        <KPICard
          title="Churn Risk"
          value={rfm.churn_risk_count.toLocaleString()}
          subtext=">90 days without order"
          icon={AlertTriangle}
          color="rose"
          badge={{ text: 'Action Needed', type: 'negative' }}
        />
      </div>

      {/* RFM Behavioral Segments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            RFM Behavioral Segments (Quintile Scoring 1-5)
          </h3>
          <span className="text-[11px] text-slate-400">
            Click segment to filter table below
          </span>
        </div>
        <CustomerSegments 
          data={rfm} 
          onSelectSegment={(seg) => setSegmentFilter(seg)} 
        />
      </div>

      {/* Cohort Retention Matrix */}
      <CohortMatrix cohorts={cohorts} />

      {/* Top Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Customer Directory & High-Value Accounts
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Detailed RFM scores, lifetime revenue, and estimated customer lifetime value.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, ID, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal">Loyal</option>
              <option value="Potential Loyalists">Potential Loyalists</option>
              <option value="At Risk">At Risk</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold text-center">RFM Score</th>
                <th className="px-4 py-3 font-semibold">Segment</th>
                <th className="px-4 py-3 font-semibold text-right">Orders</th>
                <th className="px-4 py-3 font-semibold text-right">Lifetime Spend</th>
                <th className="px-4 py-3 font-semibold text-right">Est. CLV</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((c) => {
                const isChampion = c.rfm_segment === 'Champions';
                const isAtRisk = c.rfm_segment === 'At Risk' || c.churn_risk;

                return (
                  <tr 
                    key={c.customer_id} 
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    <td className="px-4 py-3 font-bold text-white">
                      <div>{c.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{c.customer_id}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {c.city}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-blue-400 font-bold">
                        R{c.r_score}-F{c.f_score}-M{c.m_score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isChampion ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        c.rfm_segment === 'Loyal' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        c.rfm_segment === 'Potential Loyalists' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        isAtRisk ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}>
                        {c.rfm_segment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-200">
                      {c.frequency} orders
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-400">
                      ₹{c.monetary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">
                      ₹{c.estimated_clv.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.churn_risk ? (
                        <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded">
                          Churn Risk ({c.recency_days}d ago)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCustomer.customer_name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedCustomer.customer_id} · {selectedCustomer.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">RFM Behavioral Segment</span>
                <div className="text-sm font-bold text-blue-400 mt-1">{selectedCustomer.rfm_segment}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Scores: R={selectedCustomer.r_score}, F={selectedCustomer.f_score}, M={selectedCustomer.m_score}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Estimated CLV (24-Mo)</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">₹{selectedCustomer.estimated_clv.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Gross Margin: {selectedCustomer.margin_pct}%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Lifetime Revenue</span>
                <div className="text-sm font-bold text-white mt-1">₹{selectedCustomer.monetary.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Average Order: ₹{selectedCustomer.aov.toLocaleString()}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Recency & Health</span>
                <div className="text-sm font-bold text-amber-400 mt-1">{selectedCustomer.recency_days} days ago</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Total Orders: {selectedCustomer.frequency}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition cursor-pointer"
              >
                Close Customer Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
