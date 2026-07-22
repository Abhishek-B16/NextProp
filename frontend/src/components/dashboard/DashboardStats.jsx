import React from 'react';
import { Building2, Calendar, IndianRupee, Star, TrendingUp, ShieldCheck } from 'lucide-react';

export default function DashboardStats({ propertiesCount = 0, bookingsCount = 0, totalRevenue = 0, averageRating = 0 }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Properties Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Listings
          </span>
          <h3 className="text-2xl font-black text-slate-100">{propertiesCount}</h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Active Property Portfolios</span>
          </p>
        </div>
        <div className="w-12 h-12 bg-brand-500/15 border border-brand-500/30 text-brand-400 rounded-2xl flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Total Bookings Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Visit Requests
          </span>
          <h3 className="text-2xl font-black text-slate-100">{bookingsCount}</h3>
          <p className="text-[10px] text-sky-400 font-medium">
            Scheduled Customer Visits
          </p>
        </div>
        <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Estimated Revenue Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Est. Monthly Revenue
          </span>
          <h3 className="text-xl font-black text-slate-100">{formatPrice(totalRevenue)}</h3>
          <p className="text-[10px] text-emerald-400 font-medium">
            Active Rented & Sold Listings
          </p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Average Rating Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Portfolio Rating
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-slate-100">{averageRating || '5.0'}</h3>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-[10px] text-amber-400 font-medium">
            Customer Review Rating
          </p>
        </div>
        <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center">
          <Star className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
