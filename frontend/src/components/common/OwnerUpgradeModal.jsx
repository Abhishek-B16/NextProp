import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Loader2, X, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

export default function OwnerUpgradeModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { updateProfile, checkAuth } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await updateProfile({ role: 'owner' });
      if (checkAuth) await checkAuth();
      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to upgrade account role:', err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#162032] text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5 text-center py-2">
          {/* Logo Mark */}
          <div className="flex justify-center">
            <Logo size="large" showText={false} />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C9A7]/20 text-[#00C9A7] text-[10px] font-bold border border-[#00C9A7]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hosting Portal</span>
            </div>
            <h3 className="text-xl font-black text-[#F8FAFC] font-heading">Start Hosting on NextProp</h3>
            <p className="text-xs text-[#CBD5E1] max-w-xs mx-auto leading-relaxed">
              List your property, manage bookings, chat with customers and grow your rental business.
            </p>
          </div>

          {/* Benefits Box */}
          <div className="p-4 rounded-2xl bg-[#162032] border border-white/10 text-left space-y-2.5">
            <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#00C9A7]" />
              <span>Owner Benefits:</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                <span>Publish unlimited rental & sale property listings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                <span>Receive & manage customer visit tour requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />
                <span>Access live owner analytics & direct messaging</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="gradient-btn w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#00C9A7]/20 disabled:opacity-60"
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Account...</span>
                </>
              ) : (
                <>
                  <span>Become an Owner</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#162032] hover:bg-slate-800 border border-white/10 text-slate-400 text-xs font-semibold"
            >
              Cancel & Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
