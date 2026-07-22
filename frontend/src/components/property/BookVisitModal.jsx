import React, { useState } from 'react';
import { X, Calendar, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createBookingApi } from '../../services/bookingService';

export default function BookVisitModal({ propertyId, propertyTitle, isOpen, onClose }) {
  const [visitDate, setVisitDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!visitDate) {
      setErrorMessage('Please select a visit date');
      return;
    }

    setIsSubmitting(true);

    try {
      await createBookingApi({
        propertyId,
        visitDate,
        message: message.trim()
      });
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.errorMessage || 'Failed to submit visit booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMessage('');
    setVisitDate('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-2xl border border-slate-800 relative shadow-2xl animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Visit Request Sent!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your visit request for <span className="text-slate-200 font-semibold">{propertyTitle}</span> on{' '}
              <span className="text-brand-300 font-semibold">{new Date(visitDate).toLocaleDateString()}</span> has been sent to the property owner.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="gradient-btn w-full py-2.5 rounded-xl text-xs font-semibold mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>Schedule Property Visit</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 line-clamp-1">{propertyTitle}</h2>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Visit Date
                </label>
                <input
                  type="date"
                  min={minDateStr}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
                />
              </div>

              {/* Message to Owner */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Message to Owner <span className="text-slate-500 text-[10px] lowercase font-normal">(optional)</span>
                </label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Hi, I am interested in viewing this property..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Send Visit Request</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
