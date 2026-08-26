import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Syringe, 
  ShieldAlert, 
  Plus, 
  Menu, 
  X, 
  Bell, 
  FileSpreadsheet, 
  Settings, 
  Heart 
} from 'lucide-react';

interface MobileNavProps {
  onOpenAddPatient: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenAddPatient }) => {
  const { currentTab, setCurrentTab, aggregated } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const alertCount = aggregated.stats.overdue + aggregated.stats.dueSoon;

  const handleNavClick = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-base font-black text-slate-800 dark:text-slate-100">
                CareSchedule
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Offline Health App
              </div>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'dashboard'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-teal-600" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('patients')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'patients'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-teal-600" />
              <span>Patients</span>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-300">
              {aggregated.stats.totalPatients}
            </span>
          </button>

          <button
            onClick={() => handleNavClick('vaccinations')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'vaccinations'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Syringe className="w-5 h-5 text-teal-600" />
            <span>Vaccinations</span>
          </button>

          <button
            onClick={() => handleNavClick('reminders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'reminders'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Reminders</span>
            </div>
            {alertCount > 0 && (
              <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('firstAid')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'firstAid'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <span>First Aid Guide</span>
          </button>

          <button
            onClick={() => handleNavClick('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'reports'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Immunization Reports</span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'settings'
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>

        {/* Quick Add Patient Button in Drawer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setDrawerOpen(false);
              onOpenAddPatient();
            }}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Patient</span>
          </button>
        </div>
      </div>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        {/* Menu toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-600"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentTab === 'dashboard'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        {/* Floating Add Action Button */}
        <div className="relative -top-5">
          <button
            onClick={onOpenAddPatient}
            className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 border-4 border-white dark:border-slate-900 cursor-pointer"
            aria-label="Add Patient"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Vaccinations */}
        <button
          onClick={() => setCurrentTab('vaccinations')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentTab === 'vaccinations'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Syringe className="w-5 h-5" />
          <span className="text-[10px]">Vaccines</span>
        </button>

        {/* First Aid */}
        <button
          onClick={() => setCurrentTab('firstAid')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentTab === 'firstAid'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px]">First Aid</span>
        </button>
      </div>
    </>
  );
};
