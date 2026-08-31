import React from 'react';
import { VaccineStatus, BloodGroup } from '../../types';
import { CheckCircle2, AlertTriangle, Clock, Calendar, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: VaccineStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  switch (status) {
    case 'Completed':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 ${sizeClasses}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          <span>Completed</span>
        </span>
      );
    case 'Due Soon':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          <span>Due Soon</span>
        </span>
      );
    case 'Overdue':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 ${sizeClasses}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
          <span>Overdue</span>
        </span>
      );
    case 'Upcoming':
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 ${sizeClasses}`}>
          {showIcon && <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
          <span>Upcoming</span>
        </span>
      );
  }
};

export const BloodGroupBadge: React.FC<{ bloodGroup: BloodGroup | string; size?: 'sm' | 'md' }> = ({
  bloodGroup,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 font-bold' : 'text-xs px-2.5 py-1 font-bold';
  return (
    <span className={`inline-flex items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 ${sizeClasses}`}>
      {bloodGroup || '—'}
    </span>
  );
};
