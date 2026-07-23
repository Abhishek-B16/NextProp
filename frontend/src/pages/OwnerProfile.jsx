import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Clock,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CallOwnerModal from '../components/property/CallOwnerModal';
import { useAuth } from '../context/AuthContext';

export default function OwnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callModalOpen, setCallModalOpen] = useState(false);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/auth/owner/${id}`);
        if (response.data && response.data.data) {
          setOwnerData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch owner public profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOwnerProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Loading Owner Profile..." />
      </div>
    );
  }

  if (!ownerData || !ownerData.owner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-100">Owner Profile Not Found</h2>
        <p className="text-sm text-slate-400">The property owner profile you requested does not exist or has been removed.</p>
        <Link to="/properties" className="gradient-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>
      </div>
    );
  }

  const { owner, totalListings, responseTime, rating, properties } = ownerData;

  const handleStartChat = () => {
    if (!user) {
      navigate('/login?redirect=/chat');
      return;
    }
    navigate('/chat', { state: { receiverId: owner._id } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Owner Header Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Owner Avatar & Verification Badge */}
          <div className="relative flex-shrink-0">
            <img
              src={owner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={owner.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10"
            />
            {owner.isVerifiedOwner && (
              <div
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#0F172A] shadow-md"
                title="Verified Owner"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Owner Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">{owner.name}</h1>
              {owner.isVerifiedOwner && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Owner</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
              {owner.bio || 'Verified property landlord & real estate host listing premium residential and commercial spaces.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-white/10 flex items-center gap-2 text-xs text-[#CBD5E1]">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{totalListings}</span> Total Listings
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-white/10 flex items-center gap-2 text-xs text-[#CBD5E1]">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Response Time:</span>
                <span className="font-bold text-white">{responseTime}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-white/10 flex items-center gap-2 text-xs text-[#CBD5E1]">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{rating}</span> (Owner Score)
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-white/10 flex items-center gap-2 text-xs text-[#CBD5E1]">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Member Since:</span>
                <span className="font-bold text-white">
                  {new Date(owner.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <button
                type="button"
                onClick={handleStartChat}
                className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Owner</span>
              </button>

              <button
                type="button"
                onClick={() => setCallModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Contact Owner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Listings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#F8FAFC] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Properties by {owner.name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {properties.length}
            </span>
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Active Listings Currently</h3>
            <p className="text-xs text-slate-400">This owner currently has no available properties published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={{ ...property, owner }} />
            ))}
          </div>
        )}
      </div>

      {/* Call Simulator Modal */}
      <CallOwnerModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        owner={owner}
      />
    </div>
  );
}
