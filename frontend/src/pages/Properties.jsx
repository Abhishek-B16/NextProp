import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Sparkles, Building2 } from 'lucide-react';
import { getPropertiesApi } from '../services/propertyService';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PropertyFilter from '../components/property/PropertyFilter';
import PropertyGrid from '../components/property/PropertyGrid';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // State
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract initial filters from searchParams
  const filters = {
    keyword: searchParams.get('keyword') || '',
    purpose: searchParams.get('purpose') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page') || '1', 10)
  };

  // Fetch Wishlist IDs if authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getWishlistApi();
      if (data && data.data) {
        const ids = data.data.map((item) => (item.property?._id || item.property));
        setSavedPropertyIds(ids);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist status:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Fetch Properties from Backend API
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const queryApiParams = {
        limit: 9,
        page: filters.page,
        sort: filters.sort
      };

      if (filters.keyword) queryApiParams.keyword = filters.keyword;
      if (filters.purpose) queryApiParams.purpose = filters.purpose;
      if (filters.propertyType) queryApiParams.propertyType = filters.propertyType;
      if (filters.city) queryApiParams.city = filters.city;
      if (filters.state) queryApiParams.state = filters.state;
      if (filters.minPrice) queryApiParams.minPrice = filters.minPrice;
      if (filters.maxPrice) queryApiParams.maxPrice = filters.maxPrice;
      if (filters.bedrooms) queryApiParams.bedrooms = filters.bedrooms;
      if (filters.bathrooms) queryApiParams.bathrooms = filters.bathrooms;

      const data = await getPropertiesApi(queryApiParams);
      if (data) {
        setProperties(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.keyword,
    filters.purpose,
    filters.propertyType,
    filters.city,
    filters.state,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.bathrooms,
    filters.sort,
    filters.page
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handler for Filter Changes
  const handleFilterChange = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    // Reset page to 1 when filters change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handler for Reset Filters
  const handleResetFilters = () => {
    setSearchParams({});
  };

  // Handler for Sorting
  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value);
  };

  // Handler for Page Navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Toggle Wishlist
  const handleToggleWishlist = async (propertyId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/properties' } } });
      return;
    }

    const isAlreadySaved = savedPropertyIds.includes(propertyId);

    // Optimistic UI Update
    setSavedPropertyIds((prev) =>
      isAlreadySaved ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );

    try {
      if (isAlreadySaved) {
        await removeFromWishlistApi(propertyId);
        showToast('Removed from wishlist', 'info');
      } else {
        await addToWishlistApi(propertyId);
        showToast('Added to saved wishlist!', 'success');
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      showToast('Failed to update wishlist', 'error');
      // Revert optimistic update on failure
      setSavedPropertyIds((prev) =>
        isAlreadySaved ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-brand-400" />
            <span>Explore Properties</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover verified residential apartments, houses, villas, and commercial rentals
          </p>
        </div>

        {/* Mobile Filter Drawer Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <PropertyFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-slate-950 p-6 h-full overflow-y-auto border-l border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 text-sm">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PropertyFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Property Grid & Top Control Bar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Count & Sorting */}
          <div className="glass-panel px-5 py-3.5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="text-slate-400 font-medium">
              Showing <span className="text-slate-100 font-bold">{properties.length}</span> of{' '}
              <span className="text-slate-100 font-bold">{pagination.total}</span> listings
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
                Sort By:
              </span>
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-brand-500/80 cursor-pointer"
              >
                <option value="latest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Property Cards Grid */}
          <PropertyGrid
            properties={properties}
            loading={loading}
            savedPropertyIds={savedPropertyIds}
            onToggleWishlist={handleToggleWishlist}
            emptyMessage="No properties found matching your criteria. Try adjusting your search or filters."
          />

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs">
              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(pagination.pages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => handlePageChange(pNum)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        pagination.page === pNum
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={pagination.page >= pagination.pages || loading}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
