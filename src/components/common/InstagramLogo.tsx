import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const InstagramLogo: React.FC<LogoProps> = ({ className = '', size = 'md', iconOnly = false }) => {
  if (iconOnly) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-sm">
          <div className="w-6 h-6 border-2 border-white rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 border-2 border-white rounded-full"></div>
            <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-2 right-2"></div>
          </div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-logo select-none tracking-normal ${sizeClasses[size]} ${className}`}>
      Instagram
    </div>
  );
};
