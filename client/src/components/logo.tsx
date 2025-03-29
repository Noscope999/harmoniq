import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'medium', showText = false, className = '' }: LogoProps) {
  // Define sizes
  const sizes = {
    small: {
      height: 24,
      width: 24,
      iconOnly: true,
    },
    medium: {
      height: 32,
      width: 32,
      iconOnly: false,
    },
    large: {
      height: 48,
      width: 48,
      iconOnly: false,
    },
  };

  const { height, width, iconOnly } = sizes[size];
  const displayText = showText && !iconOnly;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative" style={{ height, width }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left chat bubble */}
          <path
            d="M15 45C15 32.85 24.85 23 37 23H40C50 23 58.5 30 60.5 40C60.5 40 60.5 40 60.5 40C60.5 52.15 50.65 62 38.5 62H30L20 72V62C17.24 62 15 59.76 15 57V45Z"
            fill="currentColor"
            className="text-primary"
            stroke="#1D2326"
            strokeWidth="3"
          />
          
          {/* Right chat bubble */}
          <path
            d="M85 45C85 32.85 75.15 23 63 23H60C50 23 41.5 30 39.5 40C39.5 40 39.5 40 39.5 40C39.5 52.15 49.35 62 61.5 62H70L80 72V62C82.76 62 85 59.76 85 57V45Z"
            fill="currentColor"
            className="text-primary"
            stroke="#1D2326"
            strokeWidth="3"
          />
          
          {/* Intersection section in the middle */}
          <circle cx="50" cy="40" r="12" fill="#1D2326" />
          <rect x="38" y="37" width="24" height="2" rx="1" fill="white" />
          <rect x="38" y="41" width="24" height="2" rx="1" fill="white" />
          <rect x="38" y="33" width="24" height="2" rx="1" fill="white" />
          <rect x="38" y="45" width="24" height="2" rx="1" fill="white" />
        </svg>
      </div>
      
      {displayText && (
        <span className="ml-2 font-bold text-lg text-primary">harmoniq</span>
      )}
    </div>
  );
}