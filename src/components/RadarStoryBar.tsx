import React from 'react';
import { motion } from 'motion/react';
import { Zap, Video, Camera, Scissors } from 'lucide-react';
import { ServiceOffer } from '../types';

interface RadarStoryBarProps {
  offers: ServiceOffer[];
  onSelectStory: (index: number) => void;
}

export const RadarStoryBar: React.FC<RadarStoryBarProps> = ({ offers, onSelectStory }) => {
  const sortedStories = [...offers].sort((a, b) => {
    const timeA = a.expiresInMinutes || 999;
    const timeB = b.expiresInMinutes || 999;
    return timeA - timeB;
  });

  return (
    <div className="w-full py-2.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5">
        {/* Radar Indicator */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-15 h-15 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 flex items-center justify-center shadow-sm">
            <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-center p-1 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="text-emerald-400"
              >
                <Zap className="w-4 h-4 fill-emerald-400" />
              </motion.div>
              <span className="text-[8px] font-black tracking-tighter text-emerald-300 uppercase mt-0.5">
                RADAR
              </span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
          </div>
          <span className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-tight">
            Ao Vivo
          </span>
        </div>

        {/* Stories Items */}
        {sortedStories.map((offer, index) => {
          const isUrgent = (offer.expiresInMinutes || 99) <= 20;
          const mediaTypeIcon =
            offer.mediaLevel === 3 ? (
              <Video className="w-2.5 h-2.5 text-white" />
            ) : offer.mediaLevel === 2 ? (
              <Camera className="w-2.5 h-2.5 text-white" />
            ) : (
              <Scissors className="w-2.5 h-2.5 text-white" />
            );

          return (
            <motion.button
              key={offer.id}
              onClick={() => onSelectStory(index)}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            >
              <div
                className={`relative w-15 h-15 rounded-full p-[2px] transition-all duration-300 ${
                  isUrgent
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-500 animate-pulse'
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-white flex items-center justify-center relative">
                  {offer.professionalAvatar || offer.imageUrl ? (
                    <img
                      src={offer.professionalAvatar || offer.imageUrl}
                      alt={offer.salonName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-950 flex items-center justify-center font-bold text-xs text-white">
                      {offer.salonName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 h-4 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    {mediaTypeIcon}
                  </div>
                </div>

                {offer.expiresInMinutes && (
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black text-white whitespace-nowrap shadow-sm border border-white/40 ${
                      isUrgent ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    {offer.expiresInMinutes}m
                  </div>
                )}
              </div>

              <span className="text-[10px] font-semibold text-slate-800 mt-1.5 max-w-[62px] truncate text-center leading-tight">
                {offer.salonName}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
