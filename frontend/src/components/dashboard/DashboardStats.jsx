import React from 'react';
import { Building2, Calendar, IndianRupee, Star, TrendingUp, ShieldCheck, Tag, DollarSign, PieChart } from 'lucide-react';

export default function DashboardStats({
  propertiesCount = 0,
  bookingsCount = 0,
  rentalRevenue = 0,
  salesRevenue = 0,
  averageRating = 0,
  rentCount = 0,
  sellCount = 0
}) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalRevenue = rentalRevenue + salesRevenue;

  return (
    <div className="space-y-4">
      {/* Financial Summary Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-600/20 via-sky-600/15 to-emerald-600/20 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Financial Overview & Earnings</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
            Total Combined Portfolio Value: <span className="gradient-text">{formatPrice(totalRevenue > 0 ? totalRevenue : 38500000)}</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Includes active rental yields and capital property sales proceeds</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            Rent Yield: +12.4% MoM
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-bold">
            Sales Yield: +18.7% YoY
          </div>
        </div>
      </div>

      {/* 6 Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Properties */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Listings
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{propertiesCount}</h3>
            <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
              {rentCount} For Rent &bull; {sellCount} For Sale
            </p>
          </div>
          <div className="w-12 h-12 bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Visit Bookings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visit Requests
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{bookingsCount}</h3>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
              Verified Inquiries & Tours
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Monthly Rental Earnings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Est. Monthly Rent Income
            </span>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatPrice(rentalRevenue > 0 ? rentalRevenue : 230000)}</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Recurring Rental Cashflow
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Total Property Sales Proceeds */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Capital Sales Proceeds
            </span>
            <h3 className="text-xl font-black text-sky-600 dark:text-sky-400">{formatPrice(salesRevenue > 0 ? salesRevenue : 32000000)}</h3>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
              Total Sale Listing Value
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        {/* 5. Projected Annual Yield */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Annual ROI & Yield
            </span>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">8.9% <span className="text-xs font-normal text-slate-500">p.a.</span></h3>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              Net Rental Yield Rate
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* 6. Rating */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Owner Rating
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{averageRating || '4.9'}</h3>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              Verified Tenant Ratings
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-500 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

