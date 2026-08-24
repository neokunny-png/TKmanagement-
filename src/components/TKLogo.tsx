import React from 'react';

interface TKLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'original' | 'white';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * TK Logo Emblem
 * High-precision vector recreation of the official TK brandmark:
 * - Geometric angled 'T' with diagonal top-left cut and angled bottom stem
 * - Interlocking geometric 'K' with angled bottom spine and dynamic diagonal arms
 */
export const TKLogoMark: React.FC<{
  className?: string;
  tColor?: string;
  kColor?: string;
}> = ({
  className = 'w-8 h-8',
  tColor = '#FFFFFF',
  kColor = '#3B82F6'
}) => {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-200`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Letter 'T' */}
      <path
        d="M20 30 L395 30 L345 105 L235 105 L235 285 L165 200 L165 105 L72 105 Z"
        fill={tColor}
      />
      {/* Letter 'K' */}
      <path
        d="M280 145 L345 145 L445 30 L535 30 L385 200 L535 350 L445 350 L345 240 L345 380 L280 300 Z"
        fill={kColor}
      />
    </svg>
  );
};

export const TKLogo: React.FC<TKLogoProps> = ({
  className = 'h-8 w-auto',
  variant = 'dark',
  showText = true,
  textColor,
  subtextColor
}) => {
  // Determine colors based on theme variant
  let tColor = '#FFFFFF';
  let kColor = '#38BDF8';
  let mainTextColor = textColor || 'text-white';
  let subColor = subtextColor || 'text-gray-400';

  if (variant === 'original') {
    tColor = '#0B0D12';
    kColor = '#21354F';
    mainTextColor = textColor || 'text-[#0B0D12]';
    subColor = subtextColor || 'text-gray-600';
  } else if (variant === 'light') {
    tColor = '#000000';
    kColor = '#1E3A8A';
    mainTextColor = textColor || 'text-black';
    subColor = subtextColor || 'text-gray-600';
  } else if (variant === 'white') {
    tColor = '#FFFFFF';
    kColor = '#E2E8F0';
    mainTextColor = textColor || 'text-white';
    subColor = subtextColor || 'text-gray-300';
  } else {
    // dark mode (default for TK Management luxury dark theme)
    tColor = '#FFFFFF';
    kColor = '#38BDF8';
    mainTextColor = textColor || 'text-white';
    subColor = subtextColor || 'text-gray-400';
  }

  return (
    <div className="inline-flex items-center space-x-2.5 select-none">
      <TKLogoMark
        className={className}
        tColor={tColor}
        kColor={kColor}
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-extrabold tracking-widest text-base sm:text-lg ${mainTextColor} leading-tight`}>
            TK MANAGEMENT
          </span>
          <span className={`text-[10px] ${subColor} tracking-wider font-light`}>
            ㈜TK Company
          </span>
        </div>
      )}
    </div>
  );
};
