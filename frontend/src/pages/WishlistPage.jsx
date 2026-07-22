import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowRight } from 'lucide-react';
import { getWishlistApi, removeFromWishlistApi } from '../services/wishlistService';
import PropertyGrid from '../components/property/PropertyGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWishlistApi();
      if (data && data.data) {
        // Map items to property objects
        const properties = data.data.map((item) => item.property).filter(Boolean);
        setWishlistItems(properties);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleToggleWishlist = async (propertyId) => {
    // Optimistic UI Removal
    setWishlistItems((prev) => prev.filter((p) => p._id !== propertyId));
    try {
      await removeFromWishlistApi(propertyId);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      fetchWishlist();
    }
  };

  const savedPropertyIds = wishlistItems.map((p) => p._id);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span>Saved Wishlist ({wishlistItems.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your bookmarked property listings for easy access and comparison
          </p>
        </div>

        <Link to="/properties" className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <span>Explore More Properties</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Wishlist Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your wishlist..." />
      ) : wishlistItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the heart icon on any property card to save your favorite listings here.
          </p>
          <Link to="/properties" className="gradient-btn inline-block py-2.5 px-6 rounded-xl text-xs font-bold mt-2">
            Browse Properties
          </Link>
        </div>
      ) : (
        <PropertyGrid
          properties={wishlistItems}
          loading={false}
          savedPropertyIds={savedPropertyIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
}
