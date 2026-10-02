import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  UploadCloud, 
  BarChart3,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; role: string; email: string };
  onOpenAuth: () => void;
  anomalyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  anomalyCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Intelligence', icon: Users },
    { id: 'products', label: 'Product Intelligence', icon: Package },
    { id: 'sales', label: 'Sales & Forecast', icon: TrendingUp },
    { id: 'regions', label: 'Regional', icon: MapPin },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, badge: anomalyCount },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'upload', label: 'Data Upload', icon: UploadCloud },
    { id: 'powerbi', label: 'Power BI Suite', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <span className="text-xl font-black text-white tracking-wider">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                  RETAILIQ
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                E-Commerce Sales & Customer Intelligence
              </p>
            </div>
          </div>

          {/* User & Role Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition text-left cursor-pointer"
              title="Click to switch role / user"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                {currentUser.name[0]}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1.5">
                  {currentUser.name}
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    currentUser.role === 'Analyst' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-slate-600/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">{currentUser.email}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
