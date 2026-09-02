import React from 'react';

export interface VagouLogoProps {
  variant?: 'full' | 'header' | 'icon' | 'splash' | 'compact';
  theme?: 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const VagouLogo: React.FC<VagouLogoProps> = ({
  variant = 'header',
  theme = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  // Dimension scales
  const sizeConfig = {
    xs: { icon: 20, text: 'text-base', sub: 'text-[9px]', tag: 'text-[9px]', app: 'text-[8px]' },
    sm: { icon: 26, text: 'text-lg', sub: 'text-[10px]', tag: 'text-[10px]', app: 'text-[9px]' },
    md: { icon: 34, text: 'text-2xl', sub: 'text-xs', tag: 'text-xs', app: 'text-[10px]' },
    lg: { icon: 48, text: 'text-3xl', sub: 'text-sm', tag: 'text-sm', app: 'text-xs' },
    xl: { icon: 84, text: 'text-5xl', sub: 'text-lg', tag: 'text-base', app: 'text-sm' },
  }[size];

  // SVG Checkmark "V" Icon with Official Identity Gradient & Bevel Curve
  const renderVSymbol = (customSize?: number, standalone: boolean = false) => {
    const s = customSize || sizeConfig.icon;
    const gradId = `vagouVGrad_${theme}_${size}_${Math.floor(Math.random() * 1000)}`;

    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform ${standalone ? 'filter drop-shadow-md' : ''}`}
      >
        <defs>
          <linearGradient id={gradId} x1="10%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stopColor="#087A2A" />
            <stop offset="45%" stopColor="#20C933" />
            <stop offset="100%" stopColor="#32E046" />
          </linearGradient>
          <filter id="vagouShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#087A2A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Official "V" Checkmark shape with smooth rounded nodes */}
        <path
          d="M 28 92 
             C 18 80, 32 62, 46 72 
             L 78 106 
             C 86 114, 98 112, 106 102 
             L 174 24 
             C 186 10, 202 24, 192 38 
             L 112 168 
             C 98 186, 74 186, 60 168 
             Z"
          fill={`url(#${gradId})`}
        />
      </svg>
    );
  };

  // 1. Icon Only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderVSymbol(undefined, true)}
      </div>
    );
  }

  // 2. Splash Screen Variant
  if (variant === 'splash') {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div className="relative p-3 rounded-3xl bg-[#151A1E] shadow-2xl border border-slate-800/80">
          {renderVSymbol(sizeConfig.icon, true)}
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5">
            <span className={`font-black tracking-tight text-white ${sizeConfig.text}`}>
              Vagou
            </span>
            <span className={`font-bold text-[#20C933] -mt-2.5 ${sizeConfig.app}`}>
              app
            </span>
          </div>
          <span className="text-[#20C933] font-semibold text-sm tracking-wide mt-1">
            Vagou achou.
          </span>
        </div>
      </div>
    );
  }

  // 3. Header & Full Horizontal Logo
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#151A1E]';
  const taglineColor = 'text-[#20C933]';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Símbolo "V" */}
      <div className="flex items-center justify-center">
        {renderVSymbol()}
      </div>

      {/* Tipografia Oficial Poppins */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-start">
          <span className={`font-black tracking-tight ${textColor} ${sizeConfig.text} font-['Poppins']`}>
            agou
          </span>
          <span className={`font-bold text-[#20C933] ml-0.5 -mt-1 ${sizeConfig.app} font-['Poppins']`}>
            app
          </span>
        </div>

        {(showTagline || variant === 'full') && (
          <span className={`font-semibold tracking-normal mt-0.5 ${taglineColor} ${sizeConfig.tag} font-['Poppins']`}>
            Vagou achou.
          </span>
        )}
      </div>
    </div>
  );
};

export default VagouLogo;
