import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User as UserIcon, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Home, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.CUSTOMER,
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    setErrorMessage('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name.trim()) {
      errors.name = 'Please enter your full name';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Please enter a password';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.role,
        formData.phone.trim()
      );
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden my-8">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-slate-100 mb-2 group">
            <div className="w-10 h-10 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span>Nestora</span>
          </Link>
          <p className="text-slate-400 text-sm">Join the premier property rental platform</p>
        </div>

        {/* Register Form Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Select Your Account Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Role Card */}
                <div
                  onClick={() => handleRoleSelect(ROLES.CUSTOMER)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                    formData.role === ROLES.CUSTOMER
                      ? 'bg-brand-500/10 border-brand-500 text-slate-100 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <UserIcon className={`w-5 h-5 ${formData.role === ROLES.CUSTOMER ? 'text-brand-400' : 'text-slate-400'}`} />
                    {formData.role === ROLES.CUSTOMER && (
                      <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">Customer</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Search, save wishlist, book visits, and review properties
                  </p>
                </div>

                {/* Owner Role Card */}
                <div
                  onClick={() => handleRoleSelect(ROLES.OWNER)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${
                    formData.role === ROLES.OWNER
                      ? 'bg-brand-500/10 border-brand-500 text-slate-100 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Home className={`w-5 h-5 ${formData.role === ROLES.OWNER ? 'text-brand-400' : 'text-slate-400'}`} />
                    {formData.role === ROLES.OWNER && (
                      <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">Property Owner</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Create & manage property listings and accept visit requests
                  </p>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? 'border-rose-500/60 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/30'
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? 'border-rose-500/60 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/30'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? 'border-rose-500/60 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-brand-500/80 focus:ring-brand-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number <span className="text-slate-500 text-[10px] font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/30 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-btn w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
