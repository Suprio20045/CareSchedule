import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Syringe, 
  Bell, 
  ShieldAlert, 
  FileSpreadsheet, 
  Settings,
  Heart,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, aggregated, settings } = useApp();
  const alertCount = aggregated.stats.overdue + aggregated.stats.dueSoon;

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users, badge: aggregated.stats.totalPatients },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
    { 
      id: 'reminders', 
      label: 'Reminders', 
      icon: Bell, 
      badge: alertCount > 0 ? alertCount : undefined,
      badgeColor: aggregated.stats.overdue > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
    },
    { id: 'firstAid', label: 'First Aid Guide', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex md:w-[280px] md:shrink-0 md:flex-col md:select-none md:rounded-[28px] md:border md:border-slate-200/80 md:bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.94)_100%)] md:p-4 md:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] dark:md:border-slate-800/80">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-inner shadow-slate-950/20">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#34d399,#14b8a6,#2dd4bf)] text-white shadow-[0_18px_28px_-18px_rgba(45,212,191,0.9)]">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white">
            CareSchedule
          </h1>
          <p className="text-[11px] font-medium text-teal-200/90">
            Immunization & First Aid
          </p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto px-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(168,85,247,0.18))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? 'bg-white/10 text-teal-300' : 'bg-slate-800/80 text-slate-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-slate-100'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div
          onClick={() => setCurrentTab('settings')}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 p-2.5 transition-colors hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a78bfa,#22d3ee)] text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                {settings.userName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
            <div className="text-left">
              <div className="max-w-[110px] truncate text-xs font-bold text-white">
                {settings.userName}
              </div>
              <div className="text-[10px] text-slate-400">
                {settings.role}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
