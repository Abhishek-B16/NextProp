import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Home as HomeIcon,
  Key,
  MessageSquare,
  Compass
} from 'lucide-react';
import { getPropertiesApi } from '../services/propertyService';
import PropertyGrid from '../components/property/PropertyGrid';
import { PROPERTY_TYPES } from '../constants/roles';

export default function Home() {
  const navigate = useNavigate();

  // Search State
  const [searchTab, setSearchTab] = useState('All'); // 'All' | 'Rent' | 'Sell'
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Featured Properties State
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoadingProperties(true);
      try {
        const data = await getPropertiesApi({ limit: 6, sort: 'latest' });
        if (data && data.data) {
          setFeaturedProperties(data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch featured properties:', err);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchTab !== 'All') {
      queryParams.set('purpose', searchTab);
    }
    if (searchCity.trim()) {
      queryParams.set('city', searchCity.trim());
    }
    if (searchType) {
      queryParams.set('propertyType', searchType);
    }
    if (searchKeyword.trim()) {
      queryParams.set('keyword', searchKeyword.trim());
    }

    navigate(`/properties?${queryParams.toString()}`);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Static Data Arrays
  const popularCities = [
    { name: 'Mumbai', label: 'Financial Capital', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi', label: 'Capital Region', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', label: 'Silicon Valley of India', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pune', label: 'Oxford of the East', image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', label: 'Cyberabad Hub', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', label: 'Coastal Living', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rohan Sharma',
      role: 'Tenant in Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: 'Found my dream 2BHK apartment in Bandra within 3 days. The visit booking process was seamless and the owner was verified.',
      rating: 5
    },
    {
      id: 2,
      name: 'Ananya Verma',
      role: 'Property Owner in Bangalore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'As a landlord, managing visit requests and communicating directly with genuine tenants without broker interference is fantastic.',
      rating: 5
    },
    {
      id: 3,
      name: 'Vikram Mehta',
      role: 'Buyer in Delhi NCR',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      comment: 'The advanced search filters allowed me to filter properties exactly by price, bedroom count, and city. High quality platform!',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How do I schedule a visit to a property?',
      answer: 'Browse any property listing, select your preferred visit date, and click "Request Visit". The verified property owner will review your request and accept or decline.'
    },
    {
      question: 'Is there any broker fee or hidden charges?',
      answer: 'No. NextProp facilitates direct communication between genuine property owners and buyers/tenants with zero hidden brokerage charges.'
    },
    {
      question: 'How are property owners verified on NextProp?',
      answer: 'Property owners undergo account verification by our admin moderation team. Verified owners display a gold verification badge on their listings.'
    },
    {
      question: 'How do I save properties for later review?',
      answer: 'Click the heart icon on any property card to save it directly to your personal Wishlist.'
    },
    {
      question: 'Can I upload multiple images for my property listing?',
      answer: 'Yes! Property owners can upload up to 10 high-resolution images powered by ImageKit cloud optimization.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden text-center">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Direct Owner Real Estate Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-[1.15]">
            Find Your Dream Home Without <br className="hidden sm:inline" />
            <span className="gradient-text">Brokerage or Hassle</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Search thousands of verified residential apartments, houses, villas, and commercial spaces. Connect directly with owners and schedule visits in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/properties" className="gradient-btn px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
              <span>Explore All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all">
              List Your Property
            </Link>
          </div>
        </div>

        {/* 2. SEARCH BAR SECTION */}
        <div className="max-w-4xl mx-auto mt-10 relative z-20">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl">
            {/* Purpose Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              {['All', 'Rent', 'Sell'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSearchTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    searchTab === tab
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'All' ? 'All Purpose' : `For ${tab}`}
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* City Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-4 h-4 text-brand-400" />
                </div>
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Delhi)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80 transition-all"
                />
              </div>

              {/* Property Type Selector */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4 text-brand-400" />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Property Types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="gradient-btn py-3 px-6 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-900 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Handpicked Listings</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">Featured Properties</h2>
          </div>
          <Link to="/properties" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PropertyGrid properties={featuredProperties} loading={loadingProperties} />
      </section>

      {/* 4. POPULAR CITIES SECTION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Explore Top Locations</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">Popular Cities</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <Link
              key={city.name}
              to={`/properties?city=${city.name}`}
              className="group glass-card rounded-2xl overflow-hidden relative aspect-[4/5] border border-slate-800/80 hover:border-brand-500/60 transition-all duration-300"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <h3 className="font-bold text-slate-100 text-sm group-hover:text-brand-300 transition-colors">
                  {city.name}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">{city.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CATEGORIES SECTION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Browse by Category</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">Property Types</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              to={`/properties?propertyType=${type}`}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-brand-500/60 text-center flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors">
                {type}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800/80 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">How NextProp Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 bg-brand-500/15 border border-brand-500/30 text-brand-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">1. Discover & Filter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use smart multi-criteria filters for location, budget, bedrooms, and purpose to find properties that fit your lifestyle.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 bg-brand-500/15 border border-brand-500/30 text-brand-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">2. Book a Visit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your preferred date and request a property tour directly with verified owners without any middleman fees.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 bg-brand-500/15 border border-brand-500/30 text-brand-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">3. Move In & Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Finalize rental or purchase terms, move into your new home, and leave a verified customer review.
            </p>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Community Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-bold text-slate-200">{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
