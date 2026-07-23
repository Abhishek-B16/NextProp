import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'normal', showText = true, className = '' }) {
  const isLarge = size === 'large';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Official NextProp House Mark SVG */}
      <div className={`relative flex-shrink-0 ${isLarge ? 'w-12 h-12' : 'w-9 h-9'}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        >
          {/* Outer House Roof Contour - Royal Blue */}
          <path
            d="M 50 12 L 15 42 L 25 42 L 25 82 L 75 82 L 75 42 L 85 42 Z"
            stroke="url(#royalBlueGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Window in Roof Peak */}
          <rect x="43" y="28" width="5" height="5" fill="#00C9A7" rx="1" />
          <rect x="52" y="28" width="5" height="5" fill="#00C9A7" rx="1" />
          <rect x="43" y="36" width="5" height="5" fill="#00C9A7" rx="1" />
          <rect x="52" y="36" width="5" height="5" fill="#00C9A7" rx="1" />

          {/* Monogram 'N' in Royal Blue */}
          <path
            d="M 32 78 L 32 50 L 50 78 L 50 50"
            stroke="url(#royalBlueGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Monogram 'P' & Upward Growth Arrow in Electric Teal */}
          <path
            d="M 45 72 L 82 22 M 82 22 L 68 22 M 82 22 L 82 36"
            stroke="url(#electricTealGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Location Pin at Bottom */}
          <path
            d="M 46 82 C 46 78 54 78 54 82 C 54 86 50 90 50 90 C 50 90 46 86 46 82 Z"
            fill="#00C9A7"
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066B2" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="electricTealGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C9A7" />
              <stop offset="100%" stopColor="#00D2C4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black tracking-tight leading-none text-[#F8FAFC] font-heading ${isLarge ? 'text-2xl' : 'text-xl'}`}>
            NEXTPROP<span className="text-[#00C9A7]">.in</span>
          </span>
          <span className="text-[10px] font-semibold text-[#CBD5E1] tracking-wider uppercase mt-0.5">
            Rental Properties
          </span>
        </div>
      )}
    </Link>
  );
}
