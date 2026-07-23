import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  X,
  Sparkles,
  User as UserIcon,
  Video
} from 'lucide-react';

export default function CallOwnerModal({ isOpen, onClose, owner, propertyTitle }) {
  const [copied, setCopied] = useState(false);
  const [activeCallSim, setActiveCallSim] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Call timer counter when simulation is active
  useEffect(() => {
    let timer;
    if (activeCallSim) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeCallSim]);

  if (!isOpen) return null;

  const phoneNum = owner?.phone || '+91 98765 43210';
  const cleanPhone = phoneNum.replace(/[^0-9+]/g, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSimulatedCall = () => {
    setActiveCallSim(true);
  };

  const endSimulatedCall = () => {
    setActiveCallSim(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ACTIVE CALL SIMULATOR MODE */}
        {activeCallSim ? (
          <div className="py-6 text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Prototype Call In Progress</span>
            </div>

            {/* Owner Avatar & Waveform */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-500/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-3xl shadow-xl animate-pulse">
                {owner?.name ? owner.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-500 text-white shadow-lg">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{owner?.name || 'Verified Owner'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{phoneNum}</p>
              <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-2 font-mono">
                {formatDuration(callDuration)}
              </div>
            </div>

            {/* Audio Waveform Graphic */}
            <div className="flex items-center justify-center gap-1.5 h-8 pt-2">
              <div className="w-1.5 h-6 bg-brand-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-1.5 h-8 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              <div className="w-1.5 h-7 bg-brand-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
              <div className="w-1.5 h-5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.25s]"></div>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full border transition-all ${
                  isMuted ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={endSimulatedCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3.5 rounded-full border transition-all ${
                  isSpeaker ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
                title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ) : (
          /* DEFAULT CONTACT CARD VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Contact Property Owner</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{propertyTitle}</p>
              </div>
            </div>

            {/* Owner Info Profile */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-base">
                  {owner?.name ? owner.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{owner?.name || 'Verified Owner'}</h4>
                    <ShieldCheck className="w-4 h-4 text-amber-400" title="Verified Owner" />
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Direct Owner &bull; No Brokerage</p>
                </div>
              </div>
            </div>

            {/* Direct Phone Number Box */}
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">Phone Number</span>
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-wide font-mono">{phoneNum}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="gradient-btn py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Directly</span>
              </a>

              <a
                href={`https://wa.me/${cleanPhone.replace('+', '')}?text=Hi%20${encodeURIComponent(owner?.name || 'Owner')},%20I%20am%20interested%20in%20your%20property%20listing:%20${encodeURIComponent(propertyTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Owner</span>
              </a>
            </div>

            {/* Simulated Live Call Showcase Button */}
            <button
              type="button"
              onClick={startSimulatedCall}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-brand-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Simulate Prototype In-App Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
