import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  WifiOff, 
  Check, 
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { formatRelativeCountdown } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const { 
    currentTab, 
    settings, 
    updateSettings, 
    searchQuery, 
    setSearchQuery, 
    aggregated,
    navigateToPatientSchedule,
    setCurrentTab
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    patients: 'Patient Directory',
    vaccinations: 'Vaccination Schedule',
    reminders: 'Active Reminders',
    firstAid: 'Offline First Aid Guide',
    reports: 'Immunization Reports',
    settings: 'System Settings'
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const alertItems = [
    ...aggregated.overdueQueue.map(item => ({ ...item, alertType: 'overdue' as const })),
    ...aggregated.dueSoonQueue.map(item => ({ ...item, alertType: 'dueSoon' as const }))
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 dark:border-slate-800/80 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="truncate text-xl font-black tracking-tight text-slate-800 sm:text-2xl dark:text-slate-100">
            {titleMap[currentTab] || 'CareSchedule'}
          </h2>

          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 lg:inline-flex dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Offline Ready
          </span>
        </div>

        <div className="relative mx-2 flex-1 max-w-md sm:mx-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, vaccines, topics..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-9 text-xs text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
              title="Vaccination Reminders"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {alertItems.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-500 text-[10px] font-bold text-white shadow-sm shadow-rose-500/30">
                  {alertItems.length > 9 ? '9+' : alertItems.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.45)] sm:w-96 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 p-3.5 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Vaccination Alerts
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {alertItems.length} require action
                  </span>
                </div>

                <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700/80">
                  {alertItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      <Check className="mx-auto mb-2 h-8 w-8 text-emerald-500 opacity-80" />
                      All immunization schedules are up to date!
                    </div>
                  ) : (
                    alertItems.map((item) => {
                      const countdown = formatRelativeCountdown(item.vaccine.dueDate);
                      const isOverdue = item.alertType === 'overdue';

                      return (
                        <div
                          key={`${item.patientId}-${item.vaccine.id}`}
                          onClick={() => {
                            setShowNotifications(false);
                            navigateToPatientSchedule(item.patientId);
                          }}
                          className="flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
                        >
                          <div className={`shrink-0 rounded-xl p-2 ${isOverdue ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'}`}>
                            {isOverdue ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                                {item.vaccine.vaccineName}
                              </h4>
                              <span className={`text-[10px] font-bold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {countdown.text}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                              Patient: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.patientName}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {alertItems.length > 0 && (
                  <div className="border-t border-slate-100 p-3 dark:border-slate-700/80">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab('reminders');
                      }}
                      className="flex w-full items-center justify-center gap-1 py-1 text-xs font-bold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      <span>View All in Reminders Center</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
