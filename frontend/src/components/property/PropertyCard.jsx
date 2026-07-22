import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Star, ShieldCheck, Heart } from 'lucide-react';

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    _id,
    title,
    purpose,
    propertyType,
    price,
    city,
    state,
    bedrooms = 0,
    bathrooms = 0,
    area = 0,
    images = [],
    averageRating = 0,
    numOfReviews = 0,
    owner
  } = property;

  // Extract first image URL
  const firstImage = Array.isArray(images) && images.length > 0
    ? (typeof images[0] === 'string' ? images[0] : images[0]?.url)
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const formatPrice = (val) => {
    if (!val) return '₹ 0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full border border-slate-800/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300">
      {/* Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={firstImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
              purpose === 'Rent'
                ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/20'
                : 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            For {purpose}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {propertyType}
          </span>
        </div>

        {/* Verified Owner Indicator */}
        {owner?.isVerifiedOwner && (
          <div className="absolute top-3 right-3 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 p-1.5 rounded-lg" title="Verified Owner">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="text-lg font-bold drop-shadow-md">
            {formatPrice(price)}
            {purpose === 'Rent' && <span className="text-xs font-normal text-slate-300">/month</span>}
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs bg-slate-950/70 backdrop-blur-md px-2 py-1 rounded-md border border-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{averageRating}</span>
              <span className="text-slate-400 text-[10px]">({numOfReviews})</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-1 text-base">
            <Link to={`/properties/${_id}`}>{title}</Link>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">{city}, {state}</span>
          </div>
        </div>

        {/* Property Specs */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50 flex flex-col items-center">
            <Bed className="w-4 h-4 text-brand-400 mb-1" />
            <span className="font-semibold text-slate-200">{bedrooms} Bed</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50 flex flex-col items-center">
            <Bath className="w-4 h-4 text-brand-400 mb-1" />
            <span className="font-semibold text-slate-200">{bathrooms} Bath</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50 flex flex-col items-center">
            <Maximize2 className="w-4 h-4 text-brand-400 mb-1" />
            <span className="font-semibold text-slate-200">{area} sq ft</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/properties/${_id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-slate-200 hover:text-white border border-slate-800 hover:border-brand-500 text-xs font-semibold text-center transition-all duration-200 block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
