import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, Loader2, X, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OwnerUpgradeModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await updateProfile({ role: 'owner' });
      onClose();
      navigate('/properties/add');
    } catch (err) {
      console.error('Failed to upgrade account role:', err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5 text-center py-2">
          {/* Header Icon */}
          <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Owner Listing Portal</span>
            </div>
            <h3 className="text-xl font-black text-slate-100">Want to List Your Property?</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              "List Your Property" is designed for <span className="text-emerald-400 font-bold">Property Owners, Landlords & Sellers</span> to post apartments, houses, or commercial listings.
            </p>
          </div>

          {/* Benefits Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>What Property Owners Get:</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Publish unlimited rental & sale property listings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Receive & manage customer visit tour requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Access live income analytics & zero brokerage leads</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="gradient-btn w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60"
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Upgrading Account to Owner...</span>
                </>
              ) : (
                <>
                  <span>Upgrade to Owner Account & Post Property</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold"
            >
              Cancel & Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
