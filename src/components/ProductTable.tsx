import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProductItem {
  product_name: string;
  category: string;
  revenue: number;
  profit: number;
  units_sold: number;
  margin_pct: number;
  avg_discount_pct?: number;
}

interface ProductTableProps {
  products: ProductItem[];
  title?: string;
  limit?: number;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  title = 'Product Performance Ranking',
  limit = 10
}) => {
  const displayProducts = products.slice(0, limit);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-[11px] text-slate-400">
          Showing top {displayProducts.length} items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Product Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold text-right">Units Sold</th>
              <th className="px-4 py-3 font-semibold text-right">Total Revenue</th>
              <th className="px-4 py-3 font-semibold text-right">Total Profit</th>
              <th className="px-4 py-3 font-semibold text-right">Gross Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {displayProducts.map((p, idx) => {
              const isHighMargin = p.margin_pct >= 50;
              const isLowMargin = p.margin_pct < 35;

              return (
                <tr key={p.product_name} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="px-4 py-3 font-bold text-white">
                    {p.product_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {p.units_sold.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-400">
                    ₹{(p.revenue / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                    ₹{(p.profit / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded ${
                      isHighMargin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      isLowMargin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {p.margin_pct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
