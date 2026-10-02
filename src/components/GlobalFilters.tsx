import React from 'react';
import { FilterState } from '../services/api';
import { Filter, RotateCcw, Calendar, MapPin, Tag, Users, Package } from 'lucide-react';

interface GlobalFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const CITIES = ['All', 'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Fashion', 'Books', 'Grocery'];
const SEGMENTS = ['All', 'Champions', 'Loyal', 'Potential Loyalists', 'At Risk', 'Lost'];
const PRODUCTS = [
  'All',
  'Laptop', 'Smartphone', 'Headphones', 'Smartwatch', 'Monitor',
  'Sofa', 'Dining Table', 'Office Chair', 'Bed Frame',
  'T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Saree',
  'Rice 5kg', 'Cooking Oil', 'Coffee Beans',
  'Python Book', 'Fiction Novel', 'Business Strategy'
];

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({ filters, onChange, onReset }) => {
  const isFiltered = Object.values(filters).some(v => v && v !== 'All');

  const update = (key: keyof FilterState, val: string) => {
    onChange({
      ...filters,
      [key]: val === 'All' ? undefined : val
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Interactive Global Business Filters
          </span>
          {isFiltered && (
            <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
              Active Filters
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Date Range Start */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>From Date</span>
          </label>
          <input
            type="date"
            min="2024-01-01"
            max="2024-12-31"
            value={filters.startDate || ''}
            onChange={(e) => update('startDate', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Date Range End */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>To Date</span>
          </label>
          <input
            type="date"
            min="2024-01-01"
            max="2024-12-31"
            value={filters.endDate || ''}
            onChange={(e) => update('endDate', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* City Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>City Hub</span>
          </label>
          <select
            value={filters.city || 'All'}
            onChange={(e) => update('city', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <Tag className="w-3 h-3 text-slate-500" />
            <span>Category</span>
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => update('category', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Customer Segment */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <Users className="w-3 h-3 text-slate-500" />
            <span>RFM Segment</span>
          </label>
          <select
            value={filters.segment || 'All'}
            onChange={(e) => update('segment', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Product Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            <Package className="w-3 h-3 text-slate-500" />
            <span>Product</span>
          </label>
          <select
            value={filters.product || 'All'}
            onChange={(e) => update('product', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
