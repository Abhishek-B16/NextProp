import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, Mail, ShieldCheck, Clock, XCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getMyBookingsApi, cancelBookingApi } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyBookingsApi();
      if (data && data.data) {
        setBookings(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (id) => {
    try {
      await cancelBookingApi(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      console.error('Failed to cancel booking request:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-brand-400" />
            <span>My Visit Bookings ({bookings.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and manage your scheduled property visit appointments
          </p>
        </div>

        <Link to="/properties" className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <span>Book New Visit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading your visit appointments..." />
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">No Scheduled Visit Bookings</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select any property listing and click "Book a Visit" to schedule a visit with verified owners.
          </p>
          <Link to="/properties" className="gradient-btn inline-block py-2.5 px-6 rounded-xl text-xs font-bold mt-2">
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const { _id, property, owner, visitDate, status, message, createdAt } = booking;

            const firstImage = Array.isArray(property?.images) && property.images.length > 0
              ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url)
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={_id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                {/* Top Info */}
                <div className="flex gap-4">
                  <img
                    src={firstImage}
                    alt={property?.title}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="space-y-1.5 truncate">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : status === 'completed'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 hover:text-brand-400 transition-colors truncate">
                      {property ? (
                        <Link to={`/properties/${property._id}`}>{property.title}</Link>
                      ) : (
                        'Property Listing'
                      )}
                    </h3>

                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      <span>{property?.city}, {property?.state}</span>
                    </p>

                    <div className="text-xs font-semibold text-brand-300 flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Visit Date: {new Date(visitDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Owner Contact details if accepted */}
                {status === 'accepted' && owner && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 text-xs text-emerald-300">
                    <div className="font-bold flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Visit Confirmed by Owner ({owner.name})</span>
                    </div>
                    {owner.phone && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Owner: {owner.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancel Action */}
                {status === 'pending' && (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Awaiting owner response</span>
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(_id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Request</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
