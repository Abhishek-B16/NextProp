import React from 'react';
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
  Legend
} from 'recharts';

export default function AnalyticsCharts({ monthlyData = [], statusData = [] }) {
  // Default fallback chart datasets if empty
  const defaultMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jan', bookings: 4, revenue: 120000 },
    { month: 'Feb', bookings: 7, revenue: 180000 },
    { month: 'Mar', bookings: 5, revenue: 150000 },
    { month: 'Apr', bookings: 9, revenue: 240000 },
    { month: 'May', bookings: 12, revenue: 310000 },
    { month: 'Jun', bookings: 15, revenue: 420000 }
  ];

  const defaultStatusData = statusData.length > 0 ? statusData : [
    { name: 'Available', value: 8, color: '#0c93e4' },
    { name: 'Rented', value: 5, color: '#10b981' },
    { name: 'Sold', value: 2, color: '#f59e0b' }
  ];

  const COLORS = ['#0c93e4', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Revenue & Bookings Trend Area Chart */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Revenue & Visit Trends</h3>
            <p className="text-xs text-slate-400">Monthly booking inquiries and estimated revenue growth</p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c93e4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0c93e4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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
              <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#0c93e4" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Property Listing Status Donut Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Property Status</h3>
          <p className="text-xs text-slate-400">Distribution of active listings</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defaultStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
