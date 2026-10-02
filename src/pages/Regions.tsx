import React from 'react';
import { CityData } from '../services/api';
import { RevenueChart } from '../components/RevenueChart';
import { MapPin, Trophy, Users, ShoppingBag, Percent } from 'lucide-react';

interface RegionsProps {
  cities: CityData[];
}

export const Regions: React.FC<RegionsProps> = ({ cities }) => {
  const chartData = {
    labels: cities.map(c => c.city),
    datasets: [
      {
        label: 'Total Revenue',
        data: cities.map(c => c.revenue),
        backgroundColor: '#3b82f6',
        borderRadius: 6
      },
      {
        label: 'Total Profit',
        data: cities.map(c => c.profit),
        backgroundColor: '#10b981',
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
            <span>🌆 Regional Performance & Geographic Penetration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Territory sales distribution, regional operating profit, and customer density across 10 Indian metropolitan hubs.
          </p>
        </div>
      </div>

      {/* Top Regional Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cities.slice(0, 3).map((city, idx) => (
          <div key={city.city} className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Rank #{idx + 1} Regional Market
              </span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                {city.margin_pct}% Margin
              </span>
            </div>

            <div className="mt-2 text-xl font-black text-white">
              {city.city}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Revenue</span>
                <span className="font-bold text-blue-400">₹{(city.revenue / 100000).toFixed(2)}L</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Orders</span>
                <span className="font-bold text-slate-200">{city.orders_count} orders</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Comparison Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          Revenue vs. Profit by Indian Metropolitan Hub
        </h3>
        <RevenueChart data={chartData} type="bar" height={280} />
      </div>

      {/* City Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Complete City Performance Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">City Hub</th>
                <th className="px-4 py-3 font-semibold text-right">Unique Customers</th>
                <th className="px-4 py-3 font-semibold text-right">Orders Shipped</th>
                <th className="px-4 py-3 font-semibold text-right">Total Revenue</th>
                <th className="px-4 py-3 font-semibold text-right">Total Profit</th>
                <th className="px-4 py-3 font-semibold text-right">Gross Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cities.map((c, i) => (
                <tr key={c.city} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-slate-500">#{i + 1}</td>
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {c.city}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{c.customer_count}</td>
                  <td className="px-4 py-3 text-right font-medium">{c.orders_count}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-400">
                    ₹{(c.revenue / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    ₹{(c.profit / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {c.margin_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
