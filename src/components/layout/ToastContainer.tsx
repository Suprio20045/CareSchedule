import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
        }[toast.type];

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-800/80',
          warning: 'border-amber-200 dark:border-amber-800/80',
          error: 'border-rose-200 dark:border-rose-800/80',
          info: 'border-sky-200 dark:border-sky-800/80'
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border ${borders} text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-bottom-5`}
            role="alert"
          >
            {icons}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 -mt-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
