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
            d="M20 45C20 32.85 29.85 23 42 23H45C57.15 23 67 32.85 67 45C67 57.15 57.15 67 45 67H35L25 77V67C22.24 67 20 64.76 20 62V45Z"
            fill="currentColor"
            className="text-primary"
            stroke="#1D2326"
            strokeWidth="4"
          />
          
          {/* Right chat bubble */}
          <path
            d="M33 45C33 32.85 42.85 23 55 23H58C70.15 23 80 32.85 80 45C80 57.15 70.15 67 58 67H48L38 77V67C35.24 67 33 64.76 33 62V45Z"
            fill="currentColor"
            className="text-primary"
            stroke="#1D2326"
            strokeWidth="4"
          />
          
          {/* Middle section with lines */}
          <circle cx="50" cy="45" r="10" fill="#1D2326" />
          <rect x="40" y="42" width="20" height="2" rx="1" fill="white" />
          <rect x="40" y="46" width="20" height="2" rx="1" fill="white" />
          <rect x="40" y="38" width="20" height="2" rx="1" fill="white" />
          <rect x="40" y="50" width="20" height="2" rx="1" fill="white" />
        </svg>
      </div>
      
      {displayText && (
        <span className="ml-2 font-bold text-lg text-primary">harmoniq</span>
      )}
    </div>
  );
}