import React from 'react';
import logoImage from '../assets/logo.png';

interface AyurSutraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'gradient' | 'gold' | 'premium' | 'nav';
  className?: string;
  showText?: boolean;
}

const AyurSutraLogo: React.FC<AyurSutraLogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  showText = true
}) => {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const imageSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const variantClasses = {
    default: 'text-emerald-700',
    white: 'text-white',
    gradient: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent',
    gold: 'text-amber-600',
    premium: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent',
    nav: 'text-primary' // Matches navigation bar - deep forest green
  };

  return (
    <div className={`flex items-center ${showText ? 'gap-4' : ''} ${className}`}>
      {/* Logo Image - No background container */}
      <img 
        src={logoImage} 
        alt="AyurSutra Logo" 
        className={`${imageSizes[size]} object-contain flex-shrink-0`}
      />

      {/* AYURSUTRA Text - Only shown if showText is true */}
      {showText && (
        <span className={`font-sans font-bold ${textSizes[size]} ${variantClasses[variant]} tracking-wider uppercase drop-shadow-sm`}>
          AYURSUTRA
        </span>
      )}
    </div>
  );
};

export default AyurSutraLogo;
