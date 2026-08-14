import React from 'react';
import { CheckCircle, AlertCircle, CircleInfo, X } from 'reicon-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-emerald-900 text-white border-emerald-700'
                : isWarning
                ? 'bg-amber-900 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess ? (
                <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
              ) : isWarning ? (
                <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
              ) : (
                <CircleInfo size={20} className="text-teal-400 flex-shrink-0" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-200">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer flex-shrink-0"
            >
              <X size={16} className="flex-shrink-0" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
