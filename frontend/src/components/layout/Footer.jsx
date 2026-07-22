import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants/roles';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-slate-100 font-bold text-xl tracking-tight">
              <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span>NextProp.in</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              NextProp.in is a production-ready MERN property rental and sales platform. Connect directly with verified property owners, schedule visits, and save your dream homes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="hover:text-brand-400 transition-colors">All Properties</Link>
              </li>
              <li>
                <Link to="/properties?purpose=Rent" className="hover:text-brand-400 transition-colors">Properties for Rent</Link>
              </li>
              <li>
                <Link to="/properties?purpose=Sell" className="hover:text-brand-400 transition-colors">Properties for Sale</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-400 transition-colors">Saved Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Property Types</h4>
            <ul className="space-y-2 text-xs">
              {PROPERTY_TYPES.slice(0, 5).map((type) => (
                <li key={type}>
                  <Link to={`/properties?propertyType=${type}`} className="hover:text-brand-400 transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Top Cities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/properties?city=Mumbai" className="hover:text-brand-400 transition-colors">Mumbai</Link></li>
              <li><Link to="/properties?city=Delhi" className="hover:text-brand-400 transition-colors">Delhi</Link></li>
              <li><Link to="/properties?city=Bangalore" className="hover:text-brand-400 transition-colors">Bangalore</Link></li>
              <li><Link to="/properties?city=Pune" className="hover:text-brand-400 transition-colors">Pune</Link></li>
              <li><Link to="/properties?city=Goa" className="hover:text-brand-400 transition-colors">Goa</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} NextProp.in MERN Real Estate Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
