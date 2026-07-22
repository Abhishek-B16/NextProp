import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Building2, Heart, Calendar, LogOut, User as UserIcon, PlusCircle, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-slate-100 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span>Nestora</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/properties" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
              <Building2 className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </Link>
                <Link to="/bookings" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Bookings</span>
                </Link>
              </>
            )}

            {(user?.role === ROLES.OWNER || user?.role === ROLES.ADMIN) && (
              <Link to="/properties/add" className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors">
                <PlusCircle className="w-4 h-4" />
                <span>Post Property</span>
              </Link>
            )}

            {user?.role === ROLES.ADMIN && (
              <Link to="/dashboard" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-semibold text-slate-200">{user.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase text-[10px] tracking-wider font-bold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="gradient-btn px-4 py-2 rounded-xl text-sm font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Nestora Property Rental Platform &bull; Built with MERN Stack
      </footer>
    </div>
  );
}
