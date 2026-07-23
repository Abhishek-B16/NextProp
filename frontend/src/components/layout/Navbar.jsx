import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Calendar,
  LogOut,
  User as UserIcon,
  PlusCircle,
  Sparkles,
  Home as HomeIcon,
  Search,
  Menu,
  X,
  MessageSquare,
  BarChart2,
  LayoutDashboard,
  Building,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
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

  const isOwner = user?.role === 'owner';
  const isCustomer = user?.role === 'customer';

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Official NextProp Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-[#CBD5E1]">
          {/* CUSTOMER NAVIGATION ITEMS */}
          {(!isAuthenticated || isCustomer) && (
            <>
              <Link
                to="/"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/properties"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/properties') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Explore</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive('/wishlist') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to="/bookings"
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive('/bookings') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </Link>

                  <Link
                    to="/chat"
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive('/chat') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                  </Link>
                </>
              )}

              {/* BECOME AN OWNER BUTTON */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/register?role=owner');
                  } else {
                    setUpgradeModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 text-[#00C9A7] hover:text-white font-semibold transition-all bg-[#00C9A7]/10 hover:bg-[#00C9A7]/20 px-3.5 py-1.5 rounded-xl border border-[#00C9A7]/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Become an Owner</span>
              </button>
            </>
          )}

          {/* OWNER NAVIGATION ITEMS */}
          {isAuthenticated && isOwner && (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/dashboard') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/dashboard?tab=properties"
                className="flex items-center gap-1.5 hover:text-[#00C9A7] transition-colors"
              >
                <Building className="w-4 h-4" />
                <span>My Properties</span>
              </Link>

              <Link
                to="/properties/add"
                className="flex items-center gap-1.5 text-[#00C9A7] hover:text-white font-semibold transition-all bg-[#00C9A7]/15 hover:bg-[#00C9A7] px-3.5 py-1.5 rounded-xl border border-[#00C9A7]/30 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Property</span>
              </Link>

              <Link
                to="/bookings"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/bookings') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </Link>

              <Link
                to="/chat"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/chat') ? 'text-[#00C9A7] font-bold' : 'hover:text-[#00C9A7]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Link>

              <Link
                to="/dashboard?tab=analytics"
                className="flex items-center gap-1.5 hover:text-[#00C9A7] transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>

              <Link
                to="/dashboard?tab=profile"
                className="flex items-center gap-1.5 hover:text-[#00C9A7] transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Controls (Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#162032] border border-white/10 text-xs hover:border-[#00C9A7]/40 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#00C9A7]" />
                <span className="font-bold text-[#F8FAFC]">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#00C9A7]/20 text-[#00C9A7] uppercase text-[10px] tracking-wider font-bold">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#162032] border border-white/10 text-slate-400 hover:text-rose-400 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-[#00C9A7] transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#CBD5E1] hover:text-[#00C9A7] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#00C9A7]"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#00C9A7]"
          >
            Explore
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#00C9A7]"
              >
                Wishlist
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#00C9A7]"
              >
                Bookings
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#00C9A7]"
              >
                Messages
              </Link>
            </>
          )}

          {isCustomer && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setUpgradeModalOpen(true);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-[#00C9A7]"
            >
              ✨ Become an Owner
            </button>
          )}

          {isOwner && (
            <Link
              to="/properties/add"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-bold text-[#00C9A7]"
            >
              + Add Property Listing
            </Link>
          )}

          <div className="pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-xs font-medium text-rose-400"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-[#162032] border border-white/10 rounded-xl text-xs font-medium text-[#F8FAFC]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-btn w-full text-center py-2 rounded-xl text-xs font-bold"
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
