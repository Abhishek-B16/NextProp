import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Lock, Award, Heart, Sparkles } from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants/roles';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10 text-[#CBD5E1] text-xs">
      {/* Top Professional Trust Bar */}
      <div className="border-b border-white/10 bg-[#1E293B]/60 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 font-semibold text-[#F8FAFC]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>100% Verified Direct Owners</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold text-[#F8FAFC]">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Zero Brokerage Platform</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold text-[#F8FAFC]">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>SSL Encrypted Data</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold text-[#F8FAFC]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Instant Direct Messaging</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="large" />
            <p className="text-[#CBD5E1] text-xs leading-relaxed max-w-sm">
              NextProp.in connects buyers and renters directly with verified property owners with zero brokerage fees.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Explore</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              <li><Link to="/properties" className="hover:text-[#10B981] transition-colors">All Listings</Link></li>
              <li><Link to="/properties?purpose=Rent" className="hover:text-[#10B981] transition-colors">Properties for Rent</Link></li>
              <li><Link to="/properties?purpose=Sell" className="hover:text-[#10B981] transition-colors">Properties for Sale</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#10B981] transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Categories</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              {PROPERTY_TYPES.slice(0, 5).map((type) => (
                <li key={type}>
                  <Link to={`/properties?propertyType=${type}`} className="hover:text-[#10B981] transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Top Metros</h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              <li><Link to="/properties?city=Pune" className="hover:text-[#10B981] transition-colors">Pune</Link></li>
              <li><Link to="/properties?city=Mumbai" className="hover:text-[#10B981] transition-colors">Mumbai</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="hover:text-[#10B981] transition-colors">Hyderabad</Link></li>
              <li><Link to="/properties?city=Bangalore" className="hover:text-[#10B981] transition-colors">Bangalore</Link></li>
              <li><Link to="/properties?city=Delhi" className="hover:text-[#10B981] transition-colors">Delhi</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Abhishek Branding */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1]">
          <div className="flex items-center gap-1.5 font-medium">
            <span>&copy; {new Date().getFullYear()} NextProp.in. Designed & Developed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by</span>
            <span className="font-bold text-[#F8FAFC]">Abhishek</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

