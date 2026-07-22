import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ImageGallery({ images = [], title = 'Property' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Normalize image items ({ url } or raw string)
  const imageUrls = Array.isArray(images) && images.length > 0
    ? images.map(img => (typeof img === 'string' ? img : img?.url))
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const activeImage = imageUrls[activeIndex] || imageUrls[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Feature Display */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group shadow-xl">
        <img
          src={activeImage}
          alt={`${title} view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Counter Badge */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
          <span>{activeIndex + 1} / {imageUrls.length}</span>
        </div>

        {/* Fullscreen Lightbox Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all opacity-0 group-hover:opacity-100"
          title="View Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar */}
      {imageUrls.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 aspect-[16/10] rounded-xl overflow-hidden flex-shrink-0 border transition-all ${
                activeIndex === idx
                  ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center">
            <img
              src={activeImage}
              alt="lightbox view"
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain border border-slate-800 shadow-2xl"
            />
            <div className="text-slate-400 text-sm mt-4 font-semibold">
              {activeIndex + 1} of {imageUrls.length} — {title}
            </div>

            {imageUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
