import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  Send
} from 'lucide-react';
import { getPropertiesApi } from '../services/propertyService';
import PropertyGrid from '../components/property/PropertyGrid';
import { PROPERTY_TYPES } from '../constants/roles';
import { useAuth } from '../context/AuthContext';
import OwnerUpgradeModal from '../components/common/OwnerUpgradeModal';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Search State
  const [searchTab, setSearchTab] = useState('All'); // 'All' | 'Rent' | 'Sell'
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');

  // Featured Properties & Trending State
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

    navigate(`/properties?${queryParams.toString()}`);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Demo Verified Owners Data
  const demoOwners = [
    {
      id: 'rahul',
      name: 'Rahul Patil',
      city: 'Pune & Goa',
      listingsCount: 3,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: '2 BHK Pune, Beach Villa Goa & Mumbai Sea-Facing Apartment'
    },
    {
      id: 'sneha',
      name: 'Sneha Joshi',
      city: 'Pune & Lonavala',
      listingsCount: 2,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Lonavala Farmhouse Retreat & Baner Luxury Villa'
    },
    {
      id: 'amit',
      name: 'Amit Shah',
      city: 'Mumbai & Pune',
      listingsCount: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'BKC Commercial Office & Viman Nagar Penthouse'
    },
    {
      id: 'priya',
      name: 'Priya Kulkarni',
      city: 'Bangalore & Delhi',
      listingsCount: 4,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Bangalore Smart Apartment & Vasant Vihar Delhi Villa'
    }
  ];

  const popularCities = [
    { name: 'Pune', label: 'Oxford of the East', image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mumbai', label: 'Financial Hub', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', label: 'Cyberabad Tech Zone', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', label: 'Silicon Valley', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi', label: 'Capital Region', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', label: 'Coastal Luxury', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' }
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
      answer: 'Property owners undergo verification. Verified owners display a gold verification badge on their public profile and listings.'
    },
    {
      question: 'How do I save properties for later review?',
      answer: 'Click the heart icon on any property card to save it directly to your personal Wishlist.'
    },
    {
      question: 'Can I upload multiple images for my property listing?',
      answer: 'Yes! Property owners can upload multiple high-resolution images powered by ImageKit cloud optimization.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-8 pb-14 text-center overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C9A7]/15 border border-[#00C9A7]/30 text-[#00C9A7] text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
            <span>✓ Verified Owners &bull; Zero Brokerage &bull; Trusted Listings</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.15] font-heading">
            Find Your Next Home, <br className="hidden sm:inline" />
            <span className="gradient-text">Directly From Owners.</span>
          </h1>

          {/* Subheading */}
          <p className="text-[#CBD5E1] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified apartments, villas, houses, plots and commercial spaces without brokerage. Connect directly with owners, schedule visits and find your perfect property with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/properties" className="gradient-btn px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl shadow-[#00C9A7]/20">
              <span>Explore Homes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#cities-section"
              className="px-6 py-3.5 rounded-xl bg-[#162032] hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#00C9A7]" />
              <span>Browse by City</span>
            </a>
          </div>
        </div>

        {/* 2. SEARCH BAR SECTION */}
        <div className="max-w-4xl mx-auto mt-10 relative z-20">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl">
            {/* Purpose Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              {['All', 'Rent', 'Sell'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSearchTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    searchTab === tab
                      ? 'bg-gradient-to-r from-[#0066B2] to-[#00C9A7] text-white shadow-lg shadow-[#00C9A7]/20'
                      : 'bg-[#162032] text-[#CBD5E1] hover:text-white'
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
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-[#00C9A7]" />
                </div>
                <input
                  type="text"
                  placeholder="City (e.g. Pune, Mumbai, Delhi)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#162032]/90 border border-white/10 rounded-xl text-[#F8FAFC] placeholder-[#CBD5E1]/50 text-xs focus:outline-none focus:border-[#00C9A7] transition-all"
                />
              </div>

              {/* Property Type Selector */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4 text-[#00C9A7]" />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#162032]/90 border border-white/10 rounded-xl text-[#F8FAFC] text-xs focus:outline-none focus:border-[#00C9A7] transition-all cursor-pointer"
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
                className="gradient-btn py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#00C9A7]/20"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* 3. EXPLORE BY CITY SECTION */}
      <section id="cities-section" className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Top Real Estate Destinations</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">Browse by City</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <Link
              key={city.name}
              to={`/properties?city=${city.name}`}
              className="group glass-card rounded-2xl overflow-hidden relative aspect-[4/5] border border-white/10 hover:border-[#00C9A7] transition-all duration-300 shadow-lg"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <h3 className="font-bold text-white text-sm group-hover:text-[#00C9A7] transition-colors">
                  {city.name}
                </h3>
                <p className="text-[10px] text-[#CBD5E1] line-clamp-1">{city.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Handpicked Homes</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">Featured Properties</h2>
          </div>
          <Link to="/properties" className="text-xs font-bold text-[#00C9A7] hover:underline flex items-center gap-1">
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PropertyGrid properties={featuredProperties} loading={loadingProperties} />
      </section>

      {/* 5. POPULAR OWNERS SECTION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Verified Landlords</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">Popular Property Owners</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoOwners.map((owner) => (
            <div
              key={owner.name}
              className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 text-center group hover:border-[#00C9A7]/50 transition-all shadow-xl"
            >
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="w-full h-full rounded-2xl object-cover border-2 border-[#00C9A7]/40 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#00C9A7] text-white p-1 rounded-full border-2 border-[#0F172A]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#00C9A7] transition-colors">{owner.name}</h3>
                <p className="text-xs text-[#00C9A7] font-semibold mt-0.5">{owner.city}</p>
                <p className="text-[11px] text-[#CBD5E1] line-clamp-2 mt-2 leading-relaxed">{owner.bio}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#CBD5E1]">
                <span className="font-semibold">{owner.listingsCount} Verified Listings</span>
                <span className="text-[#00C9A7] font-bold">★ 4.9 Rating</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PROPERTY CATEGORIES SECTION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Browse by Category</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">Property Types</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              to={`/properties?propertyType=${type}`}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-[#00C9A7] text-center flex flex-col items-center justify-center space-y-2 group transition-all"
            >
              <div className="w-11 h-11 bg-[#00C9A7]/10 rounded-xl flex items-center justify-center text-[#00C9A7] group-hover:bg-[#00C9A7] group-hover:text-white transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#00C9A7] transition-colors">
                {type}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Community Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed italic">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">{t.name}</h4>
                  <p className="text-[10px] text-[#CBD5E1]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 font-heading">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-bold text-[#F8FAFC]">{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs text-[#CBD5E1] leading-relaxed border-t border-white/10 pt-3 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SIGNUP SECTION */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2 relative z-10">
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Stay Informed</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] font-heading">Subscribe to Property Updates</h2>
          <p className="text-xs text-[#CBD5E1]">Get new property listings, rental insights, and direct owner updates delivered to your inbox.</p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-[#00C9A7]/20 border border-[#00C9A7]/40 text-[#00C9A7] text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you for subscribing to NextProp!</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#162032] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#CBD5E1]/50 focus:outline-none focus:border-[#00C9A7]"
            />
            <button
              type="submit"
              className="gradient-btn w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </section>

      {/* Upgrade Modal for Customer Account */}
      <OwnerUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}
