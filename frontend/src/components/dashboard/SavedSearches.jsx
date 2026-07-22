import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, ArrowRight, Bookmark } from 'lucide-react';

export default function SavedSearches() {
  const savedShortcuts = [
    {
      id: 1,
      title: '2BHK Apartments in Mumbai',
      subtitle: 'For Rent &bull; Min 2 Bedrooms',
      path: '/properties?city=Mumbai&purpose=Rent&propertyType=Apartment&bedrooms=2'
    },
    {
      id: 2,
      title: 'Luxury Villas in Goa',
      subtitle: 'For Rent & Sale &bull; Villa Category',
      path: '/properties?city=Goa&propertyType=Villa'
    },
    {
      id: 3,
      title: 'Commercial Spaces in Bangalore',
      subtitle: 'IT Hub &bull; Commercial Category',
      path: '/properties?city=Bangalore&propertyType=Commercial'
    },
    {
      id: 4,
      title: 'Budget Apartments in Pune',
      subtitle: 'For Rent &bull; Max ₹35,000',
      path: '/properties?city=Pune&purpose=Rent&maxPrice=35000'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-100">Saved Search Shortcuts</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">1-Click Filter Links</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedShortcuts.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/60 transition-all group flex items-center justify-between gap-3"
          >
            <div className="space-y-1 truncate">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-brand-400 transition-colors truncate">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-brand-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
