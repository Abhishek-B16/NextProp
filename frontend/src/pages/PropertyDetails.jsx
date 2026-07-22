import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
  ShieldCheck,
  Heart,
  Share2,
  Calendar,
  Phone,
  Mail,
  User as UserIcon,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Building2,
  MessageSquare
} from 'lucide-react';
import { getPropertyByIdApi } from '../services/propertyService';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from '../services/wishlistService';
import { createOrGetConversationApi } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import ImageGallery from '../components/property/ImageGallery';
import PropertyMap from '../components/property/PropertyMap';
import BookVisitModal from '../components/property/BookVisitModal';
import ReviewSection from '../components/property/ReviewSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch Property & Wishlist status
  const fetchProperty = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPropertyByIdApi(id);
      if (data && data.data) {
        setProperty(data.data);
      }
    } catch (err) {
      console.error('Failed to load property details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkWishlist = useCallback(async () => {
    if (!isAuthenticated || !id) return;
    try {
      const data = await getWishlistApi();
      if (data && data.data) {
        const saved = data.data.some((item) => (item.property?._id || item.property) === id);
        setIsSaved(saved);
      }
    } catch (err) {
      console.warn('Wishlist check failed:', err);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchProperty();
    checkWishlist();
  }, [fetchProperty, checkWishlist]);

  // Wishlist Toggle
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      if (isSaved) {
        await removeFromWishlistApi(id);
      } else {
        await addToWishlistApi(id);
      }
    } catch (err) {
      setIsSaved(!nextSavedState);
    }
  };

  // Copy Share Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookVisitClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }
    setBookingModalOpen(true);
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }
    const ownerId = owner?._id || owner;
    if (!ownerId || ownerId === user?._id) return;

    try {
      const data = await createOrGetConversationApi(ownerId);
      if (data && data.data) {
        navigate(`/chat/${data.data._id}`);
      }
    } catch (err) {
      console.error('Failed to initiate chat:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800 my-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Property Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The listing may have been removed or deleted by the owner.</p>
        <Link to="/properties" className="gradient-btn py-2 px-6 rounded-xl text-xs font-semibold">
          Back to All Properties
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    purpose,
    propertyType,
    price,
    address,
    city,
    state,
    pincode,
    bedrooms = 0,
    bathrooms = 0,
    area = 0,
    amenities = [],
    images = [],
    owner,
    status = 'available',
    averageRating = 0,
    numOfReviews = 0
  } = property;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/properties" className="hover:text-brand-400 transition-colors">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold truncate max-w-xs">{title}</span>
      </nav>

      {/* Title & Action Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                purpose === 'Rent'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              For {purpose}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
              {propertyType}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                status === 'available'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-100">{title}</h1>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span>{address ? `${address}, ` : ''}{city}, {state} {pincode ? `- ${pincode}` : ''}</span>
          </div>
        </div>

        {/* Share & Wishlist Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all relative"
            title="Share Property Link"
          >
            <Share2 className="w-5 h-5" />
            {copiedLink && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`p-3 rounded-xl border transition-all ${
              isSaved
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={images} title={title} />

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details, Specs, Amenities, Map, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specifications Grid */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/60 flex flex-col items-center">
              <Bed className="w-5 h-5 text-brand-400 mb-1.5" />
              <span className="text-sm font-bold text-slate-100">{bedrooms} Bedrooms</span>
              <span className="text-[10px] text-slate-500">Living Spaces</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/60 flex flex-col items-center">
              <Bath className="w-5 h-5 text-brand-400 mb-1.5" />
              <span className="text-sm font-bold text-slate-100">{bathrooms} Bathrooms</span>
              <span className="text-[10px] text-slate-500">Fitted Baths</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/60 flex flex-col items-center">
              <Maximize2 className="w-5 h-5 text-brand-400 mb-1.5" />
              <span className="text-sm font-bold text-slate-100">{area} sq ft</span>
              <span className="text-[10px] text-slate-500">Super Area</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/60 flex flex-col items-center">
              <Building2 className="w-5 h-5 text-brand-400 mb-1.5" />
              <span className="text-sm font-bold text-slate-100">{propertyType}</span>
              <span className="text-[10px] text-slate-500">Category</span>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-100">About this Property</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Amenities Grid */}
          {amenities && amenities.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100">Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 text-xs text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Leaflet Map */}
          <PropertyMap city={city} state={state} address={address} title={title} />

          {/* Reviews Section */}
          <ReviewSection
            propertyId={id}
            averageRating={averageRating}
            numOfReviews={numOfReviews}
          />
        </div>

        {/* Right Column: Sticky Action Sidebar & Owner Details */}
        <div className="space-y-6">
          {/* Price & Action Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 sticky top-20 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Listing Price
              </span>
              <div className="text-3xl font-black text-slate-100">
                {formatPrice(price)}
                {purpose === 'Rent' && <span className="text-xs font-normal text-slate-400"> /month</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBookVisitClick}
                className="gradient-btn w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Visit Request</span>
              </button>

              {owner && owner._id !== user?._id && (
                <button
                  type="button"
                  onClick={handleStartChat}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-brand-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Owner</span>
                </button>
              )}
            </div>

            {/* Owner Details Section */}
            {owner && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Property Owner</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-base flex-shrink-0">
                    {owner.name ? owner.name.charAt(0).toUpperCase() : 'O'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-sm font-bold text-slate-100">{owner.name}</h5>
                      {owner.isVerifiedOwner && (
                        <ShieldCheck className="w-4 h-4 text-amber-400" title="Verified Property Owner" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {owner.isVerifiedOwner ? 'Verified Owner' : 'Property Listing Owner'}
                    </p>
                  </div>
                </div>

                {owner.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <Mail className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                )}
                {owner.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <Phone className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    <span>{owner.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Visit Modal Dialog */}
      <BookVisitModal
        propertyId={id}
        propertyTitle={title}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
