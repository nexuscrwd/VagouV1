import React, { useEffect, useState } from 'react';
import { VagouLogo } from './VagouLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1500,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, durationMs - 400);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#151A1E] text-white transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div className="flex flex-col items-center justify-center gap-6 animate-fadeIn">
        {/* Official V Symbol in Center */}
        <div className="relative flex items-center justify-center p-4">
          <VagouLogo variant="icon" size="xl" theme="dark" />
        </div>

        {/* Brand Name & Official Tagline */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-start">
            <span className="text-3xl font-black tracking-tight text-white font-['Poppins']">
              Vagou
            </span>
            <span className="text-xs font-bold text-[#20C933] ml-1 -mt-1 font-['Poppins']">
              app
            </span>
          </div>
          <span className="text-[#20C933] text-sm font-semibold tracking-wide mt-1.5 font-['Poppins']">
            Vagou achou.
          </span>
        </div>
      </div>

      {/* Footer Branding / Indicator */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <div className="w-6 h-1 rounded-full bg-[#20C933]/30 overflow-hidden">
          <div className="w-full h-full bg-[#20C933] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
