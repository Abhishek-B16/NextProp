import React from 'react';
import PropertyCard from './PropertyCard';

export default function PropertyGrid({
  properties = [],
  loading = false,
  emptyMessage = 'No properties found matching your criteria.',
  savedPropertyIds = [],
  onToggleWishlist
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="glass-panel rounded-2xl overflow-hidden animate-pulse border border-slate-800">
            <div className="aspect-[16/10] bg-slate-900"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-900 rounded w-3/4"></div>
              <div className="h-3 bg-slate-900 rounded w-1/2"></div>
              <div className="h-10 bg-slate-900 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800 my-4">
        <p className="text-slate-400 font-medium text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isSaved={savedPropertyIds.includes(property._id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}
