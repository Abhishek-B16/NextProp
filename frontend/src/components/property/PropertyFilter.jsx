import React from 'react';
import { Search, MapPin, Building2, RotateCcw, Filter, IndianRupee, Bed, Bath } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_PURPOSES } from '../../constants/roles';

export default function PropertyFilter({ filters, onFilterChange, onResetFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
          <Filter className="w-4 h-4 text-brand-400" />
          <span>Filter Properties</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-brand-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="keyword"
            value={filters.keyword || ''}
            onChange={handleChange}
            placeholder="Title, description, location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
          />
        </div>
      </div>

      {/* 2. Purpose Tabs (Rent / Sell) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {['', 'Rent', 'Sell'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onFilterChange('purpose', p)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                (filters.purpose || '') === p
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === '' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Property Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Property Type
        </label>
        <select
          name="propertyType"
          value={filters.propertyType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Location (City & State) */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Location
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <input
            type="text"
            name="city"
            value={filters.city || ''}
            onChange={handleChange}
            placeholder="City (e.g. Mumbai)"
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
          />
        </div>
        <input
          type="text"
          name="state"
          value={filters.state || ''}
          onChange={handleChange}
          placeholder="State (e.g. Maharashtra)"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
        />
      </div>

      {/* 5. Price Range */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min Price"
            min="0"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max Price"
            min="0"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
          />
        </div>
      </div>

      {/* 6. Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-brand-400" />
            <span>Min Beds</span>
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleChange}
            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-brand-400" />
            <span>Min Baths</span>
          </label>
          <select
            name="bathrooms"
            value={filters.bathrooms || ''}
            onChange={handleChange}
            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Bathrooms</option>
            <option value="2">2+ Bathrooms</option>
            <option value="3">3+ Bathrooms</option>
          </select>
        </div>
      </div>
    </div>
  );
}
