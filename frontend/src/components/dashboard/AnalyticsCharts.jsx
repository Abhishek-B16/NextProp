import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsCharts({ monthlyData = [], statusData = [] }) {
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'bookings'

  // Default fallback chart datasets if empty
  const defaultMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jan', bookings: 6, rentIncome: 140000, salesIncome: 12000000 },
    { month: 'Feb', bookings: 9, rentIncome: 185000, salesIncome: 15000000 },
    { month: 'Mar', bookings: 12, rentIncome: 210000, salesIncome: 18000000 },
    { month: 'Apr', bookings: 15, rentIncome: 245000, salesIncome: 22000000 },
    { month: 'May', bookings: 18, rentIncome: 290000, salesIncome: 28000000 },
    { month: 'Jun', bookings: 22, rentIncome: 340000, salesIncome: 35000000 }
  ];

  const defaultStatusData = statusData.length > 0 ? statusData : [
    { name: 'For Rent', value: 12, color: '#0c93e4' },
    { name: 'For Sale', value: 8, color: '#10b981' },
    { name: 'Occupied/Rented', value: 6, color: '#8b5cf6' },
    { name: 'Sold', value: 3, color: '#f59e0b' }
  ];

  const COLORS = ['#0c93e4', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Revenue & Rental/Sales Growth Area Chart */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Income & Inquiries Growth</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of rental cashflow & visit requests</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'revenue'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Income (₹)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('bookings')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'bookings'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Visit Tours
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c93e4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0c93e4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              {chartMetric === 'revenue' ? (
                <Area type="monotone" dataKey="rentIncome" name="Rental Income (₹)" stroke="#0c93e4" fillOpacity={1} fill="url(#colorRent)" />
              ) : (
                <Area type="monotone" dataKey="bookings" name="Scheduled Visits" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Property Portfolio Distribution Donut Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Buy/Sell & Rent Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of active & fulfilled property deals</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defaultStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {defaultStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

