import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  BarChart3,
  User as UserIcon,
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  ShieldCheck,
  Loader2,
  TrendingUp,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPropertiesApi, deletePropertyApi } from '../services/propertyService';
import { getOwnerBookingsApi, updateBookingStatusApi } from '../services/bookingService';
import DashboardStats from '../components/dashboard/DashboardStats';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import OwnerBookingsTable from '../components/dashboard/OwnerBookingsTable';
import ProfileSettings from '../components/dashboard/ProfileSettings';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  // Data States
  const [myProperties, setMyProperties] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Owner Data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch properties owned by logged in user
      const propRes = await getPropertiesApi({ limit: 100 });
      if (propRes && propRes.data) {
        // Filter properties where owner === user._id
        const filteredProps = propRes.data.filter(
          (p) => (p.owner?._id || p.owner) === user?._id
        );
        setMyProperties(filteredProps.length > 0 ? filteredProps : propRes.data);
      }

      // 2. Fetch visit booking requests
      const bookRes = await getOwnerBookingsApi();
      if (bookRes && bookRes.data) {
        setOwnerBookings(bookRes.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch warning:', err);
    } fontFinally: {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Tab Switcher
  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  // Property Deletion
  const handleDeleteProperty = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deletePropertyApi(deleteId);
      setMyProperties((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete property:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Booking Status Update
  const handleBookingStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatusApi(bookingId, status);
      setOwnerBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  // Calculations for Metrics
  const totalRevenue = myProperties.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const avgRating = (
    myProperties.reduce((acc, curr) => acc + (curr.averageRating || 5), 0) /
    (myProperties.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-brand-400" />
            <span>Property Owner Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, <span className="text-slate-200 font-bold">{user?.name}</span> &bull; Manage listings, review visit requests, and view analytics
          </p>
        </div>

        <Link
          to="/properties/add"
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Property</span>
        </Link>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-thin">
        {[
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'properties', label: `My Properties (${myProperties.length})`, icon: Building2 },
          { key: 'bookings', label: `Visit Bookings (${ownerBookings.length})`, icon: Calendar },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 },
          { key: 'profile', label: 'Profile & Settings', icon: UserIcon }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stats Bar */}
          <DashboardStats
            propertiesCount={myProperties.length}
            bookingsCount={ownerBookings.length}
            totalRevenue={totalRevenue}
            averageRating={avgRating}
          />

          {/* Charts Row */}
          <AnalyticsCharts />

          {/* Recent Bookings & Properties Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Visit Requests */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>Recent Visit Requests</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleTabChange('bookings')}
                  className="text-xs text-brand-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <OwnerBookingsTable
                bookings={ownerBookings.slice(0, 4)}
                loading={loading}
                onStatusChange={handleBookingStatusChange}
              />
            </div>

            {/* Quick Properties Overview */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <span>My Active Listings</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleTabChange('properties')}
                  className="text-xs text-brand-400 font-semibold hover:underline"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-3">
                {myProperties.slice(0, 4).map((prop) => (
                  <div
                    key={prop._id}
                    className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-100 truncate">{prop.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{prop.city}, {prop.state} &bull; For {prop.purpose}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-slate-200">₹ {prop.price?.toLocaleString()}</div>
                      <span className="text-[10px] text-emerald-400 uppercase font-semibold">{prop.status || 'Available'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY PROPERTIES TAB */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">My Property Listings ({myProperties.length})</h2>
            <Link to="/properties/add" className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Add Property</span>
            </Link>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-5 py-3.5">Purpose & Type</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {myProperties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-100 max-w-xs truncate">
                        <Link to={`/properties/${prop._id}`} className="hover:text-brand-400 transition-colors">
                          {prop.title}
                        </Link>
                        <div className="text-[10px] text-slate-400 font-normal">{prop.city}, {prop.state}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-200">For {prop.purpose}</span>
                        <div className="text-[10px] text-slate-400">{prop.propertyType}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-100">
                        ₹ {prop.price?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {prop.status || 'Available'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/properties/${prop._id}`}
                            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/properties/edit/${prop._id}`}
                            className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white border border-brand-500/20 transition-all"
                            title="Edit Listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteId(prop._id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Manage Visit Requests ({ownerBookings.length})</h2>
          </div>

          <OwnerBookingsTable
            bookings={ownerBookings}
            loading={loading}
            onStatusChange={handleBookingStatusChange}
          />
        </div>
      )}

      {/* 4. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-slate-100">Analytics & Performance Breakdown</h2>
          <AnalyticsCharts />
        </div>
      )}

      {/* 5. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="animate-fadeIn">
          <ProfileSettings />
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Delete Property Listing?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this property? All images and details will be permanently removed.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
