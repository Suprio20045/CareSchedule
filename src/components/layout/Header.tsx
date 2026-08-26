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
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 truncate">
          {titleMap[currentTab] || 'CareSchedule'}
        </h2>
        
        {/* Offline Badge */}
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Offline Ready
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, vaccines, topics..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell with popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Vaccination Reminders"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {alertItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {alertItems.length > 9 ? '9+' : alertItems.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Vaccination Alerts
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {alertItems.length} require action
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
                {alertItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
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
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isOverdue ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'}`}>
                          {isOverdue ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {item.vaccine.vaccineName}
                            </h4>
                            <span className={`text-[10px] font-bold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {countdown.text}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            Patient: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.patientName}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {alertItems.length > 0 && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setCurrentTab('reminders');
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center justify-center gap-1 w-full cursor-pointer py-1"
                  >
                    <span>View All in Reminders Center</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
