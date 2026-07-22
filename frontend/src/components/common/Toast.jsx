import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const { id, message, type } = toast;

        return (
          <div
            key={id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-slideUp transition-all ${
              type === 'error'
                ? 'bg-slate-950/95 border-rose-500/40 text-rose-400'
                : type === 'info'
                ? 'bg-slate-950/95 border-sky-500/40 text-sky-400'
                : 'bg-slate-950/95 border-emerald-500/40 text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {type === 'error' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : type === 'info' ? (
                <Info className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-xs font-semibold text-slate-100">{message}</span>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(id)}
              className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
