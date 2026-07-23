import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Heart,
  Calendar,
  LogOut,
  User as UserIcon,
  PlusCircle,
  ShieldCheck,
  Home as HomeIcon,
  Search,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import OwnerUpgradeModal from '../common/OwnerUpgradeModal';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleListPropertyClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/properties/add');
    } else if (user?.role === 'customer') {
      setUpgradeModalOpen(true);
    } else {
      navigate('/properties/add');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B101B]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
          <div className="w-9 h-9 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-slate-100 font-black">NextProp<span className="text-emerald-400">.in</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/properties"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/properties') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explore Properties</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/wishlist') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/bookings"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/bookings') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </Link>

              <Link
                to="/chat"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/chat') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </Link>
            </>
          )}

          {/* List / Post Property CTA Button */}
          <button
            type="button"
            onClick={handleListPropertyClick}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-white font-semibold transition-all bg-emerald-500/15 hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Property</span>
          </button>

          {user?.role === ROLES.ADMIN && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Desktop Controls (Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-emerald-500/40 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-200">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase text-[10px] tracking-wider font-bold">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-emerald-400 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B101B] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Explore Properties
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
              >
                Wishlist
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
              >
                Bookings
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
              >
                Chat
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleListPropertyClick(e);
            }}
            className="block w-full text-left py-2 text-sm font-bold text-emerald-400"
          >
            + Post Property Listing
          </button>

          {user?.role === ROLES.ADMIN && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-amber-400"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm font-medium text-rose-400"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-btn w-full text-center py-2 rounded-xl text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Modal for Customers */}
      <OwnerUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </header>
  );
}

