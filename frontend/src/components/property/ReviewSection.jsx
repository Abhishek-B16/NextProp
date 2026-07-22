import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, AlertCircle, Send, User as UserIcon, Loader2 } from 'lucide-react';
import { getPropertyReviewsApi, createReviewApi } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

export default function ReviewSection({ propertyId, averageRating = 0, numOfReviews = 0 }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReviews = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const data = await getPropertyReviewsApi(propertyId);
      if (data && data.data) {
        setReviews(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!comment.trim()) {
      setErrorMessage('Please write a review comment');
      return;
    }

    setSubmitting(true);

    try {
      await createReviewApi(propertyId, { rating, comment: comment.trim() });
      setSuccessMessage('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setErrorMessage(err.errorMessage || 'Only customers with a verified booking can review this property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            <span>Customer Reviews</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Ratings and feedback from verified visitors</p>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-100">{averageRating}</span>
          <span className="text-xs text-slate-400">({numOfReviews} reviews)</span>
        </div>
      </div>

      {/* Write a Review Form */}
      {isAuthenticated && user?.role === 'customer' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Leave a Review</h4>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              {successMessage}
            </div>
          )}

          {/* Star Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Your Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience regarding the property, neighborhood, or owner interaction..."
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={submitting}
            className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Post Review</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="p-4 bg-slate-900/40 rounded-xl animate-pulse space-y-2">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="h-3 bg-slate-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-4">
          No reviews posted yet for this property.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-brand-500/20 text-brand-300 rounded-full flex items-center justify-center font-bold text-xs">
                    {rev.customer?.name ? rev.customer.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{rev.customer?.name || 'Verified Customer'}</h5>
                    <span className="text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-9">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
