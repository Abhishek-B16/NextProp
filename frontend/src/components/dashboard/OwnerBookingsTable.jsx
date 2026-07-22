import React from 'react';
import { Calendar, User as UserIcon, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function OwnerBookingsTable({ bookings = [], loading = false, onStatusChange }) {
  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center animate-pulse space-y-3">
        <div className="h-4 bg-slate-900 rounded w-1/3 mx-auto"></div>
        <div className="h-20 bg-slate-900 rounded"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center border border-slate-800 space-y-2">
        <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-200">No Visit Bookings Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          When customers request visit dates to view your properties, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Property</th>
              <th className="px-5 py-3.5">Customer Details</th>
              <th className="px-5 py-3.5">Visit Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {bookings.map((booking) => {
              const { _id, property, customer, visitDate, status, message } = booking;

              return (
                <tr key={_id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Property */}
                  <td className="px-5 py-4 font-semibold text-slate-100 max-w-xs truncate">
                    {property?.title || 'Property Listing'}
                    {message && (
                      <p className="text-[11px] text-slate-400 font-normal italic line-clamp-1 mt-0.5">
                        "{message}"
                      </p>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-brand-500/20 text-brand-300 rounded-full flex items-center justify-center font-bold text-xs">
                        {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{customer?.name || 'Customer'}</div>
                        <div className="text-[10px] text-slate-400">{customer?.email || customer?.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Visit Date */}
                  <td className="px-5 py-4 font-medium text-slate-200">
                    {new Date(visitDate).toLocaleDateString()}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
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
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 text-right">
                    {status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onStatusChange(_id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(_id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-semibold text-[11px] transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(_id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] transition-all"
                      >
                        Mark Completed
                      </button>
                    )}

                    {(status === 'rejected' || status === 'completed' || status === 'cancelled') && (
                      <span className="text-[11px] text-slate-500 italic">No actions</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
