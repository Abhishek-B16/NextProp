import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AdminAnalyticsCharts({
  monthlyData = [],
  typeData = [],
  purposeData = []
}) {
  const defaultMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 24 },
    { month: 'Apr', count: 31 },
    { month: 'May', count: 42 },
    { month: 'Jun', count: 58 }
  ];

  const defaultTypeData = typeData.length > 0 ? typeData : [
    { type: 'Apartment', count: 15 },
    { type: 'House', count: 8 },
    { type: 'Villa', count: 6 },
    { type: 'Commercial', count: 4 },
    { type: 'Studio', count: 3 }
  ];

  const defaultPurposeData = purposeData.length > 0 ? purposeData : [
    { purpose: 'Rent', count: 22, color: '#38bdf8' },
    { purpose: 'Sell', count: 14, color: '#34d399' }
  ];

  const COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#a78bfa', '#f43f5e'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Bookings Trend */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Platform Visit Requests Trend</h3>
          <p className="text-xs text-slate-400">Total monthly booking inquiries across all properties</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="adminBookingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
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
              <Area type="monotone" dataKey="count" name="Bookings" stroke="#38bdf8" fillOpacity={1} fill="url(#adminBookingsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Purpose Distribution Pie Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Rent vs Sell Listings</h3>
          <p className="text-xs text-slate-400">Distribution by purpose</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defaultPurposeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
                nameKey="purpose"
              >
                {defaultPurposeData.map((entry, index) => (
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

      {/* 3. Property Type Bar Chart */}
      <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Property Categories Breakdown</h3>
          <p className="text-xs text-slate-400">Total active listings per category</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defaultTypeData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
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
              <Bar dataKey="count" name="Listings Count" fill="#38bdf8" radius={[8, 8, 0, 0]}>
                {defaultTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
