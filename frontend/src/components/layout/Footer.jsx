import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Lock, Award, Heart, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants/roles';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      {/* Top Professional Trust Bar */}
      <div className="border-b border-slate-200 dark:border-slate-900/80 bg-slate-50/60 dark:bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Verified Direct Owners</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-brand-500" />
            <span>Zero Brokerage Charges</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>SSL Secured Platform</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Visit Booking</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-black text-xl tracking-tight">
              <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span>NextProp<span className="text-brand-500">.in</span></span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              NextProp.in is India's leading direct owner real estate ecosystem. Connect directly with authentic property owners, tour homes virtually, schedule visits, and buy or rent seamlessly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Listings</Link>
              </li>
              <li>
                <Link to="/properties?purpose=Rent" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Properties for Rent</Link>
              </li>
              <li>
                <Link to="/properties?purpose=Sell" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Properties for Sale</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Saved Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Categories</h4>
            <ul className="space-y-2 text-xs">
              {PROPERTY_TYPES.slice(0, 5).map((type) => (
                <li key={type}>
                  <Link to={`/properties?propertyType=${type}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Top Metros</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/properties?city=Mumbai" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Mumbai</Link></li>
              <li><Link to="/properties?city=Delhi" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Delhi</Link></li>
              <li><Link to="/properties?city=Bangalore" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Bangalore</Link></li>
              <li><Link to="/properties?city=Pune" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pune</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Hyderabad</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Abhishek Branding */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>&copy; {new Date().getFullYear()} NextProp.in. Designed & Developed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">Abhishek</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

