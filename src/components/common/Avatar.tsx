import React from 'react';

interface AvatarProps {
  name: string;
  seed?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gender?: 'Male' | 'Female' | 'Other';
}

const COLOR_PAIRS = [
  { bg: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200 border-teal-200 dark:border-teal-800' },
  { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800' },
  { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800' },
  { bg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800' },
  { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-800' },
  { bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800' },
  { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-200 dark:border-rose-800' },
  { bg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800' },
];

export const Avatar: React.FC<AvatarProps> = ({ name, seed, size = 'md', gender }) => {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'P';

  const charCodeSum = (seed || name || 'A')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const colorPair = COLOR_PAIRS[charCodeSum % COLOR_PAIRS.length];

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-bold shadow-xs border shrink-0 transition-transform ${sizeClasses} ${colorPair.bg}`}
      title={name}
    >
      <span>{initials}</span>
      {gender && (
        <span 
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 ${
            gender === 'Female' ? 'bg-pink-400' : gender === 'Male' ? 'bg-blue-400' : 'bg-slate-400'
          }`} 
        />
      )}
    </div>
  );
};
