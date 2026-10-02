import React from 'react';
import { X, ShieldCheck, UserCheck, Eye, Key } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { email: string; name: string; role: string }) => void;
  currentUser: { email: string; name: string; role: string };
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser
}) => {
  if (!isOpen) return null;

  const roles = [
    {
      role: 'Admin',
      name: 'Matam Rohith',
      email: 'admin@retailiq.in',
      icon: ShieldCheck,
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-400',
      desc: 'Full access to Executive Dashboard, Data ETL Uploads, API controls & system settings.'
    },
    {
      role: 'Analyst',
      name: 'Senior BI Analyst',
      email: 'analyst@retailiq.in',
      icon: UserCheck,
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-400',
      desc: 'Access to Customer Intelligence, RFM models, Cohort Retention, and Product margins.'
    },
    {
      role: 'Viewer',
      name: 'Executive Viewer',
      email: 'viewer@retailiq.in',
      icon: Eye,
      color: 'border-slate-600 bg-slate-800/40 text-slate-300',
      desc: 'Read-only access to high-level KPIs, Regional metrics, and AI summary briefings.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Platform Authentication & RBAC
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400 leading-relaxed">
          Select a pre-configured role to simulate role-based authorization in RetailIQ:
        </p>

        <div className="mt-4 space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => {
                  onLogin({ email: r.email, name: r.name, role: r.role });
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:border-blue-500 ${
                  isCurrent ? 'ring-2 ring-blue-500 bg-blue-950/30 border-blue-500/50' : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${r.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {r.role}
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.2 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {r.email}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
