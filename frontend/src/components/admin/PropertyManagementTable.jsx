import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Trash2, Eye, MapPin, ShieldCheck } from 'lucide-react';

export default function PropertyManagementTable({
  properties = [],
  loading = false,
  onDeleteProperty
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');

  const filteredProps = properties.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose = purposeFilter ? p.purpose === purposeFilter : true;
    return matchesSearch && matchesPurpose;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 space-y-4 p-5">
      {/* Search & Purpose Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search listings by title, city, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80"
          />
        </div>

        <select
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none cursor-pointer"
        >
          <option value="">All Listing Purposes</option>
          <option value="Rent">For Rent</option>
          <option value="Sell">For Sale</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Property</th>
              <th className="px-5 py-3.5">Purpose & Type</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Owner</th>
              <th className="px-5 py-3.5 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">Loading listings...</td>
              </tr>
            ) : filteredProps.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">No properties match criteria</td>
              </tr>
            ) : (
              filteredProps.map((prop) => (
                <tr key={prop._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-100 max-w-xs truncate">
                    <Link to={`/properties/${prop._id}`} className="hover:text-brand-400 transition-colors">
                      {prop.title}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-normal">{prop.city}, {prop.state}</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-200">For {prop.purpose}</span>
                    <div className="text-[10px] text-slate-400">{prop.propertyType}</div>
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-100">
                    ₹ {prop.price?.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-200">{prop.owner?.name || 'Owner'}</span>
                      {prop.owner?.isVerifiedOwner && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" title="Verified Owner" />
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/properties/${prop._id}`}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteProperty(prop._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
                        title="Delete Property Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
