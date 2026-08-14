import React from 'react';

interface AgriTrustLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  darkMode?: boolean;
}

export const AgriTrustLogo: React.FC<AgriTrustLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  darkMode = false,
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: { width: 32, height: 32, titleText: 'text-base sm:text-lg', subText: 'text-[9px]', eudrText: 'text-[7.5px]' },
    md: { width: 42, height: 42, titleText: 'text-lg sm:text-xl', subText: 'text-[10px] sm:text-[11px]', eudrText: 'text-[8px]' },
    lg: { width: 54, height: 54, titleText: 'text-xl sm:text-2xl', subText: 'text-xs', eudrText: 'text-[9px]' },
    xl: { width: 68, height: 68, titleText: 'text-2xl sm:text-3xl', subText: 'text-sm', eudrText: 'text-[10px]' },
  };

  const currentSize = iconSizes[size];

  // Guaranteed inline styles & robust Tailwind classes preventing any CSS override
  const agriStyle: React.CSSProperties = {
    color: darkMode ? '#34d399' : '#166534',
  };

  const trustStyle: React.CSSProperties = {
    color: darkMode ? '#ffffff' : '#0a2472',
  };

  const exportStyle: React.CSSProperties = {
    color: darkMode ? '#7dd3fc' : '#0a2472',
  };

  const eudrStyle: React.CSSProperties = {
    color: darkMode ? '#6ee7b7' : '#15803d',
  };

  const leafDotStyle: React.CSSProperties = {
    color: darkMode ? '#6ee7b7' : '#15803d',
  };

  const underlineStyle: React.CSSProperties = {
    background: darkMode
      ? 'linear-gradient(to right, #34d399, #2dd4bf, #38bdf8)'
      : 'linear-gradient(to right, #166534, #0d9488, #0a2472)',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap flex-shrink-0 ${className}`}>
      {/* Precision Vector Emblem matching Brand Specifications */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="leafGradMain" x1="40" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="60%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <linearGradient id="leafGradLeft" x1="20" y1="50" x2="80" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          <linearGradient id="leafGradRight" x1="70" y1="40" x2="130" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <linearGradient id="shipGrad" x1="90" y1="80" x2="145" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="55" y1="95" x2="85" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <linearGradient id="swirlGrad" x1="20" y1="120" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="60%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        {/* 1. Blockchain IoT Nodes Arc (Top Left) */}
        <path
          d="M 22 105 A 64 64 0 0 1 92 20"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 0"
        />
        {/* Node Circles */}
        <circle cx="22" cy="105" r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="26" cy="68" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="50" cy="38" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="92" cy="20" r="5" fill="#166534" stroke="#FFFFFF" strokeWidth="2" />

        {/* 2. Terraced Green Agricultural Base Field */}
        <path
          d="M 24 128 C 35 110 50 100 70 98 C 75 118 65 135 48 142 C 36 140 28 135 24 128 Z"
          fill="#064E3B"
        />
        {/* Terrace Furrow Stripes */}
        <path d="M 32 135 C 40 125 52 118 64 115" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
        <path d="M 40 142 C 48 134 56 128 66 126" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />

        {/* 3. Three Sprouting Coffee Leaves */}
        {/* Left Leaf */}
        <path
          d="M 68 108 C 42 98 28 75 35 62 C 48 50 72 75 68 108 Z"
          fill="url(#leafGradLeft)"
        />
        <path d="M 40 68 Q 52 82 66 102" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* Center Main Leaf */}
        <path
          d="M 70 110 C 56 75 52 35 70 24 C 88 35 84 75 70 110 Z"
          fill="url(#leafGradMain)"
        />
        <path d="M 70 28 L 70 105" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <path d="M 70 45 Q 62 55 58 60" stroke="#DCFCE7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <path d="M 70 60 Q 78 68 81 74" stroke="#DCFCE7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

        {/* Right Leaf */}
        <path
          d="M 72 108 C 85 85 105 60 120 70 C 122 86 98 105 72 108 Z"
          fill="url(#leafGradRight)"
        />
        <path d="M 115 73 Q 98 88 76 104" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* 4. Maritime Logistics Cargo Vessel & Export Momentum Arrow */}
        {/* Stacked Containers */}
        <g transform="translate(86, 75)">
          {/* Layer 1 containers */}
          <rect x="0" y="6" width="9" height="6" rx="1" fill="#38BDF8" stroke="#0369A1" strokeWidth="0.8" />
          <rect x="10" y="6" width="9" height="6" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
          <rect x="20" y="6" width="9" height="6" rx="1" fill="#38BDF8" stroke="#0369A1" strokeWidth="0.8" />
          {/* Layer 2 container */}
          <rect x="5" y="-1" width="9" height="6" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
          <rect x="15" y="-1" width="9" height="6" rx="1" fill="#38BDF8" stroke="#0369A1" strokeWidth="0.8" />
          
          {/* Ship Hull */}
          <path
            d="M -4 13 L 34 13 L 28 23 C 18 24 2 24 -4 13 Z"
            fill="url(#shipGrad)"
          />

          {/* Upward Export Transit Arrow */}
          <path
            d="M 32 10 L 44 -2 M 44 -2 L 36 -2 M 44 -2 L 44 6"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 5. Trust & Verification Shield with Checkmark */}
        <g transform="translate(62, 98)">
          {/* Shield Outline & Base */}
          <path
            d="M 15 0 C 27 0 29 6 30 15 C 30 28 15 38 15 38 C 15 38 0 28 0 15 C 1 6 3 0 15 0 Z"
            fill="url(#shieldGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Checkmark inside Shield */}
          <path
            d="M 8 16 L 13 22 L 23 10"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 6. Dynamic Swoosh / Wave Baseline */}
        <path
          d="M 20 128 C 30 148 60 155 90 152 C 120 148 142 130 148 115 C 138 128 115 142 85 144 C 55 146 32 140 20 128 Z"
          fill="url(#swirlGrad)"
        />
      </svg>

      {/* Typography Lockup matching the brand specifications */}
      {showText && (
        <div className="flex flex-col justify-center leading-none whitespace-nowrap flex-shrink-0">
          <div className="flex items-baseline font-extrabold tracking-tight whitespace-nowrap flex-shrink-0">
            <span 
              style={agriStyle}
              className={`${currentSize.titleText} font-black relative whitespace-nowrap flex-shrink-0 transition-colors`}
            >
              Agri
              {/* Leaf dot over 'i' in Agri */}
              <svg 
                style={leafDotStyle}
                className="w-2.5 h-2.5 absolute -top-1 right-0 transform -rotate-12 flex-shrink-0 transition-colors"
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4.5 3.5-.5 8.5 0 11 2.5" />
              </svg>
            </span>
            <span 
              style={trustStyle}
              className={`${currentSize.titleText} font-black ml-0.5 whitespace-nowrap flex-shrink-0 transition-colors`}
            >
              Trust
            </span>
          </div>

          {/* Underline separator */}
          <div 
            style={underlineStyle}
            className="h-0.5 w-full my-0.5 rounded-full flex-shrink-0" 
          />

          {/* Export Subtitle */}
          <div className="flex items-center justify-between whitespace-nowrap flex-shrink-0">
            <span 
              style={exportStyle}
              className={`${currentSize.subText} font-extrabold uppercase tracking-[0.22em] whitespace-nowrap flex-shrink-0 transition-colors`}
            >
              Export
            </span>
            <span 
              style={eudrStyle}
              className={`${currentSize.eudrText} font-bold tracking-wider whitespace-nowrap flex-shrink-0 transition-colors`}
            >
              EUDR
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
