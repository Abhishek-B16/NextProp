import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-6xl font-black text-brand-500 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="gradient-btn inline-block py-2.5 px-6 rounded-xl text-sm font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
