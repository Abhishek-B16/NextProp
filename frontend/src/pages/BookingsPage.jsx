import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  XCircle,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Building2,
  Check,
  X,
  UserCheck,
  User,
  Filter
} from 'lucide-react';
import { getMyBookingsApi, getOwnerBookingsApi, updateBookingStatusApi, cancelBookingApi } from '../services/bookingService';
import { createOrGetConversationApi } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active Tab: 'myVisits' (as visitor) | 'receivedRequests' (as owner)
  const [activeTab, setActiveTab] = useState('myVisits');
  const [statusFilter, setStatusFilter] = useState('all');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings based on active tab
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'receivedRequests') {
        data = await getOwnerBookingsApi();
      } else {
        data = await getMyBookingsApi();
      }

      if (data && data.data) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Landlord/Owner Response Handling (Accept / Decline / Complete)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateBookingStatusApi(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(`Failed to update booking status to ${newStatus}:`, err);
    }
  };

  // Open Direct Chat with Owner or Visitor
  const handleStartChat = async (targetUserId) => {
    if (!targetUserId) return;
    try {
      await createOrGetConversationApi(targetUserId);
      navigate('/chat', { state: { receiverId: targetUserId } });
    } catch (err) {
      console.error('Failed to initiate chat:', err);
      navigate('/chat');
    }
  };

  // Filter Bookings by status
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" />
            <span>Visit Management Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Property Visit Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your visit bookings, respond to prospective clients, and coordinate site tours cleanly.
          </p>
        </div>

        <Link
          to="/properties"
          className="gradient-btn px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto shadow-lg shadow-brand-500/20"
        >
          <span>Explore Properties</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Controls: Role Tabs & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-slate-800">
        {/* Role Perspective Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('myVisits');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'myVisits'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Scheduled Visits</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('receivedRequests');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'receivedRequests'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Received Visit Requests</span>
          </button>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1 hidden lg:block" />
          {['all', 'pending', 'accepted', 'rejected', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-800 text-brand-300 border border-brand-500/40'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid / Empty State */}
      {loading ? (
        <LoadingSpinner message="Fetching visit appointments..." />
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800/80 max-w-md mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">
            {activeTab === 'receivedRequests' ? 'No Received Visit Requests' : 'No Scheduled Visits Found'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeTab === 'receivedRequests'
              ? 'When buyers or renters request to visit your posted properties, their requests will appear here for you to accept or decline.'
              : 'Browse our property marketplace and click "Book a Visit" on any listing to schedule your appointment.'}
          </p>
          {activeTab === 'myVisits' && (
            <Link to="/properties" className="gradient-btn inline-block py-2.5 px-6 rounded-xl text-xs font-bold mt-2">
              Explore Properties
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const { _id, property, customer, owner, visitDate, status, message, createdAt } = booking;

            const isOwnerView = activeTab === 'receivedRequests';
            const partnerUser = isOwnerView ? customer : owner;

            const firstImage = Array.isArray(property?.images) && property.images.length > 0
              ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url)
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={_id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-200"
              >
                {/* Header: Property & Status Pill */}
                <div className="flex items-start gap-4">
                  <Link to={property ? `/properties/${property._id}` : '#'} className="flex-shrink-0">
                    <img
                      src={firstImage}
                      alt={property?.title || 'Property'}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-slate-800 hover:opacity-90 transition-opacity"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : status === 'completed'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : status === 'cancelled'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {status}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {new Date(createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-100 hover:text-brand-400 transition-colors line-clamp-1">
                      {property ? (
                        <Link to={`/properties/${property._id}`}>{property.title}</Link>
                      ) : (
                        'Property Listing'
                      )}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      <span>{property?.city}, {property?.state}</span>
                    </p>

                    {/* Scheduled Date */}
                    <div className="text-xs font-semibold text-brand-300 flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>Visit Date: {new Date(visitDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Visitor / Owner Detail Banner */}
                {partnerUser && (
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {partnerUser.name ? partnerUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">
                          {isOwnerView ? `Visitor: ${partnerUser.name}` : `Property Owner: ${partnerUser.name}`}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {partnerUser.email} {partnerUser.phone ? `• ${partnerUser.phone}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartChat(partnerUser._id)}
                      className="px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all"
                      title="Send message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                )}

                {/* Additional Note/Message if exists */}
                {message && (
                  <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 italic leading-relaxed">
                    "{message}"
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  {/* LANDLORD / OWNER CONTROLS (Received Requests) */}
                  {isOwnerView ? (
                    status === 'pending' ? (
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(_id, 'rejected')}
                          className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(_id, 'accepted')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    ) : status === 'accepted' ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Visit Request Approved
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(_id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-semibold transition-all"
                        >
                          Mark Completed
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Status: {status}</span>
                    )
                  ) : (
                    /* TENANT / VISITOR CONTROLS (My Scheduled Visits) */
                    status === 'pending' ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-slate-500">Awaiting property owner approval</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(_id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Request</span>
                        </button>
                      </div>
                    ) : status === 'accepted' ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Visit Approved! Contact owner above.
                        </span>
                        {owner?.phone && (
                          <a
                            href={`tel:${owner.phone}`}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Owner</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Status: {status}</span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
