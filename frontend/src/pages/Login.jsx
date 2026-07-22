import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Load remembered email on mount if present
  useEffect(() => {
    const savedEmail = localStorage.getItem('nestora_remembered_email');
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Please enter your password';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      await login(formData.email.trim(), formData.password);

      // Handle Remember Me preference
      if (formData.rememberMe) {
        localStorage.setItem('nestora_remembered_email', formData.email.trim());
      } else {
        localStorage.removeItem('nestora_remembered_email');
      }

      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-slate-100 mb-2 group">
            <div className="w-10 h-10 bg-brand-500/15 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span>Nestora</span>
          </Link>
          <p className="text-slate-400 text-sm">Welcome back! Sign in to access your account</p>
        </div>

        {/* Login Form Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
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
                  placeholder="••••••••"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-brand-500/30 focus:ring-offset-0"
                />
                <span>Remember email on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-btn w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
