import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, size = 32, message = 'Loading Nestora...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 style={{ width: size, height: size }} className="text-brand-500 animate-spin mb-2" />
      {message && <p className="text-slate-400 text-xs font-medium">{message}</p>}
    </div>
  );
}
