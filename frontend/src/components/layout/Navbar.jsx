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
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../constants/roles';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 dark:bg-slate-950/85 html-light:bg-white/90 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 html-light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
          <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-slate-900 dark:text-slate-100">NextProp.in</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/') ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'hover:text-brand-500'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/properties"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/properties') ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'hover:text-brand-500'
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
                  isActive('/wishlist') ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'hover:text-brand-500'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/bookings"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/bookings') ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'hover:text-brand-500'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </Link>

              <Link
                to="/chat"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/chat') ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'hover:text-brand-500'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </Link>
            </>
          )}

          {(user?.role === ROLES.OWNER || user?.role === ROLES.ADMIN) && (
            <Link
              to="/properties/add"
              className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-500 font-semibold transition-colors bg-brand-500/10 px-3 py-1.5 rounded-xl border border-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
            </Link>
          )}

          {user?.role === ROLES.ADMIN && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 hover:text-amber-400 font-semibold transition-colors bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Desktop Controls (Theme Toggle & Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light/Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-600 dark:text-brand-300 uppercase text-[10px] tracking-wider font-bold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="gradient-btn px-4 py-2 rounded-xl text-sm font-medium">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-400 hover:text-brand-500 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500"
          >
            Explore Properties
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500"
              >
                Wishlist
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500"
              >
                Bookings
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500"
              >
                Chat
              </Link>
            </>
          )}

          {(user?.role === ROLES.OWNER || user?.role === ROLES.ADMIN) && (
            <Link
              to="/properties/add"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
              Post Property Listing
            </Link>
          )}

          {user?.role === ROLES.ADMIN && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-amber-500 dark:text-amber-400"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-900">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm font-medium text-rose-500"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200"
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
    </header>
  );
}
