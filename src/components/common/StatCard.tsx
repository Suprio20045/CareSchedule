import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  variant: 'emerald' | 'blue' | 'amber' | 'rose';
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant,
  trend,
  onClick
}) => {
  const styles = {
    emerald: {
      bgIcon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      badge: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300'
    },
    blue: {
      bgIcon: 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
      borderHover: 'hover:border-sky-300 dark:hover:border-sky-700',
      badge: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300'
    },
    amber: {
      bgIcon: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
      badge: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300'
    },
    rose: {
      bgIcon: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
      badge: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300'
    }
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md ' + styles.borderHover : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bgIcon}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {value}
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {title}
        </div>
        {subtext && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
