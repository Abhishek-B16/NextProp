import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  BarChart3,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  Server,
  Database,
  Calendar
} from 'lucide-react';
import {
  getAdminAnalyticsApi,
  getAdminUsersApi,
  verifyOwnerApi,
  deleteUserApi,
  getAdminPropertiesApi,
  deleteAdminPropertyApi
} from '../services/adminService';
import AdminAnalyticsCharts from '../components/admin/AdminAnalyticsCharts';
import UserManagementTable from '../components/admin/UserManagementTable';
import PropertyManagementTable from '../components/admin/PropertyManagementTable';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analytics';

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deletePropId, setDeletePropId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Admin Data
  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, propsRes] = await Promise.all([
        getAdminAnalyticsApi(),
        getAdminUsersApi(),
        getAdminPropertiesApi()
      ]);

      if (analyticsRes && analyticsRes.data) setAnalytics(analyticsRes.data);
      if (usersRes && usersRes.data) setUsers(usersRes.data);
      if (propsRes && propsRes.data) setProperties(propsRes.data);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  // Toggle Owner Verification
  const handleVerifyToggle = async (userId) => {
    try {
      const data = await verifyOwnerApi(userId);
      if (data && data.data) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isVerifiedOwner: data.data.isVerifiedOwner } : u))
        );
      }
    } catch (err) {
      console.error('Failed to toggle verification:', err);
    }
  };

  // Delete User Account
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setActionLoading(true);
    try {
      await deleteUserApi(deleteUserId);
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
      setDeleteUserId(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Property Listing
  const handleDeleteProperty = async () => {
    if (!deletePropId) return;
    setActionLoading(true);
    try {
      await deleteAdminPropertyApi(deletePropId);
      setProperties((prev) => prev.filter((p) => p._id !== deletePropId));
      setDeletePropId(null);
    } catch (err) {
      console.error('Failed to delete property:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const tabs = [
    { key: 'analytics', label: 'Analytics & Stats', icon: BarChart3 },
    { key: 'users', label: `Users (${users.length})`, icon: Users },
    { key: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
    { key: 'reports', label: 'Reports & Health', icon: FileText }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <span>Platform Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nestora System Dashboard &bull; Manage accounts, verify owners, moderate listings, and inspect analytics
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-amber-300 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>System Admin Mode</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-thin">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ANALYTICS & STATS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
                <h3 className="text-2xl font-black text-slate-100">{analytics?.summary?.totalUsers || users.length}</h3>
                <p className="text-[10px] text-sky-400 font-medium">{analytics?.usersBreakdown?.ownersCount || 0} Owners &bull; {analytics?.usersBreakdown?.customersCount || 0} Customers</p>
              </div>
              <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Properties</span>
                <h3 className="text-2xl font-black text-slate-100">{analytics?.summary?.totalProperties || properties.length}</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Platform Listings Portfolio</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</span>
                <h3 className="text-2xl font-black text-slate-100">{analytics?.summary?.totalBookings || 0}</h3>
                <p className="text-[10px] text-amber-400 font-medium">Scheduled Visit Inquiries</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Value</span>
                <h3 className="text-xl font-black text-slate-100">{formatPrice(analytics?.summary?.totalRevenue)}</h3>
                <p className="text-[10px] text-purple-400 font-medium">Total Listings Value</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-2xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recharts Data Graphs */}
          <AdminAnalyticsCharts
            monthlyData={analytics?.charts?.monthlyBookingsChart}
            typeData={analytics?.charts?.propertyTypeDistribution}
            purposeData={analytics?.charts?.purposeDistribution}
          />
        </div>
      )}

      {/* 2. USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">User Management & Owner Verification</h2>
          </div>

          <UserManagementTable
            users={users}
            loading={loading}
            onVerifyToggle={handleVerifyToggle}
            onDeleteUser={(id) => setDeleteUserId(id)}
          />
        </div>
      )}

      {/* 3. PROPERTY MANAGEMENT TAB */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Property Listings Moderation</h2>
          </div>

          <PropertyManagementTable
            properties={properties}
            loading={loading}
            onDeleteProperty={(id) => setDeletePropId(id)}
          />
        </div>
      )}

      {/* 4. REPORTS & SYSTEM HEALTH TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-slate-100">System Infrastructure & Health Reports</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MongoDB Connection Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">MongoDB Atlas Database</h4>
                  <span className="text-xs text-emerald-400 font-semibold">Connected (Replica Set)</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mongoose ORM connected with indexes on users, properties text search, composite wishlist indices, and aggregation pipelines.
              </p>
            </div>

            {/* Express Server Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-xl flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Express & Socket.io Server</h4>
                  <span className="text-xs text-sky-400 font-semibold">Active & Listening (Port 5000)</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Node.js HTTP server running MVC controllers, JWT cookie authentication, and Socket.io WebSocket rooms.
              </p>
            </div>

            {/* ImageKit Cloud Storage */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">ImageKit Media Cloud</h4>
                  <span className="text-xs text-purple-400 font-semibold">Active Integration</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multer memory storage uploading compressed property images directly to ImageKit with automatic deletion purging.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Delete User Account?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this user account? This operation cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteUserId(null)}
                disabled={actionLoading}
                className="w-1/2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Property Modal */}
      {deletePropId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Moderate Property Listing?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this listing? All images will be purged from ImageKit.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletePropId(null)}
                disabled={actionLoading}
                className="w-1/2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={actionLoading}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Moderate Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
