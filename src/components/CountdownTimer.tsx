import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  expiresTimestamp?: number;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes = 20,
  expiresTimestamp,
  compact = false,
}) => {
  const targetTime = expiresTimestamp || Date.now() + initialMinutes * 60 * 1000;
  const [timeLeftMs, setTimeLeftMs] = useState<number>(Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const totalMinutes = Math.floor(timeLeftMs / 60000);
  const seconds = Math.floor((timeLeftMs % 60000) / 1000);
  const formattedTime = `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isVeryUrgent = totalMinutes < 15;
  const progressPercent = Math.min(100, Math.max(8, (timeLeftMs / (30 * 60 * 1000)) * 100));

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm transition-all ${
          isVeryUrgent
            ? 'bg-rose-500/90 text-white animate-pulse'
            : 'bg-emerald-500/90 text-white'
        }`}
      >
        <Clock className="w-3 h-3" />
        <span>{formattedTime}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
        <div className="flex items-center gap-1">
          {isVeryUrgent ? (
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className={isVeryUrgent ? 'text-amber-300' : 'text-emerald-300'}>
            {isVeryUrgent ? 'VAGA RELÂMPAGO' : 'DISPONÍVEL AGORA'}
          </span>
        </div>
        <span className="font-mono text-white/90 text-xs">
          Expira em {formattedTime}
        </span>
      </div>

      {/* Visual Urgency Progress Bar */}
      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isVeryUrgent
              ? 'bg-gradient-to-r from-amber-400 to-rose-500'
              : 'bg-gradient-to-r from-emerald-400 to-teal-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
