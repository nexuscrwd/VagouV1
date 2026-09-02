import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Video, Camera, Scissors, Check } from 'lucide-react';
import { ServiceOffer } from '../types';

interface RadarStoryBarProps {
  offers: ServiceOffer[];
  selectedSalonFilter?: string | null;
  onToggleSalonFilter?: (salonName: string) => void;
  onClearFilter?: () => void;
  onSelectStory?: (index: number) => void;
}

export const RadarStoryBar: React.FC<RadarStoryBarProps> = ({
  offers,
  selectedSalonFilter = null,
  onToggleSalonFilter,
  onClearFilter,
  onSelectStory,
}) => {
  // Group offers by salon so each salon has a single unique circle with lowest expiration and total active slots count
  const salonStories = useMemo(() => {
    const map = new Map<string, {
      salonName: string;
      professionalName: string;
      avatar?: string;
      imageUrl?: string;
      minExpires: number;
      mediaLevel: number;
      offersCount: number;
      representativeOffer: ServiceOffer;
      firstIndex: number;
    }>();

    offers.forEach((offer, idx) => {
      const existing = map.get(offer.salonName);
      const expires = offer.expiresInMinutes || 999;
      if (!existing) {
        map.set(offer.salonName, {
          salonName: offer.salonName,
          professionalName: offer.professionalName,
          avatar: offer.professionalAvatar,
          imageUrl: offer.imageUrl,
          minExpires: expires,
          mediaLevel: offer.mediaLevel || 1,
          offersCount: 1,
          representativeOffer: offer,
          firstIndex: idx,
        });
      } else {
        existing.offersCount += 1;
        if (expires < existing.minExpires) {
          existing.minExpires = expires;
        }
        if ((offer.mediaLevel || 1) > existing.mediaLevel) {
          existing.mediaLevel = offer.mediaLevel || 1;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => a.minExpires - b.minExpires);
  }, [offers]);

  return (
    <div className="w-full py-2.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5">
        {/* Radar Indicator / Reset Filter Button */}
        <motion.button
          onClick={() => onClearFilter?.()}
          whileTap={{ scale: 0.94 }}
          className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
          title="Ver todas as vagas"
        >
          <div
            className={`relative w-15 h-15 rounded-full p-0.5 transition-all duration-300 ${
              !selectedSalonFilter
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 opacity-70 group-hover:opacity-100'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-center p-1 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className={!selectedSalonFilter ? 'text-emerald-400' : 'text-slate-400'}
              >
                <Zap className={`w-4 h-4 ${!selectedSalonFilter ? 'fill-emerald-400' : ''}`} />
              </motion.div>
              <span className="text-[8px] font-black tracking-tighter text-emerald-300 uppercase mt-0.5 font-['Poppins']">
                TODOS
              </span>
            </div>
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-950 ${
                !selectedSalonFilter ? 'bg-[#20C933]' : 'bg-slate-500'
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-bold mt-1 uppercase tracking-tight font-['Poppins'] ${
              !selectedSalonFilter ? 'text-[#20C933]' : 'text-slate-400 group-hover:text-slate-200'
            }`}
          >
            Feed Geral
          </span>
        </motion.button>

        {/* Stories Items (One per Salon/Professional) */}
        {salonStories.map((story) => {
          const isSelected = selectedSalonFilter === story.salonName;
          const isUrgent = story.minExpires <= 20;
          const hasFilterActive = selectedSalonFilter !== null;

          const mediaTypeIcon =
            story.mediaLevel === 3 ? (
              <Video className="w-2.5 h-2.5 text-white" />
            ) : story.mediaLevel === 2 ? (
              <Camera className="w-2.5 h-2.5 text-white" />
            ) : (
              <Scissors className="w-2.5 h-2.5 text-white" />
            );

          return (
            <motion.button
              key={story.salonName}
              onClick={() => {
                if (onToggleSalonFilter) {
                  onToggleSalonFilter(story.salonName);
                } else if (onSelectStory) {
                  onSelectStory(story.firstIndex);
                }
              }}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center flex-shrink-0 group focus:outline-none transition-all duration-300 ${
                hasFilterActive && !isSelected ? 'opacity-40 hover:opacity-90' : 'opacity-100'
              }`}
            >
              <div
                className={`relative w-15 h-15 rounded-full p-[2px] transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-[#20C933] ring-offset-2 ring-offset-slate-950 scale-105 bg-emerald-500 shadow-lg shadow-emerald-500/30'
                    : isUrgent
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-500'
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-slate-950 flex items-center justify-center relative">
                  {story.avatar || story.imageUrl ? (
                    <img
                      src={story.avatar || story.imageUrl}
                      alt={story.salonName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-950 flex items-center justify-center font-bold text-xs text-white">
                      {story.salonName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Media icon or Selected checkmark */}
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-black/65 backdrop-blur-xs flex items-center justify-center">
                    {isSelected ? (
                      <Check className="w-3 h-3 text-[#20C933] stroke-[3]" />
                    ) : (
                      mediaTypeIcon
                    )}
                  </div>
                </div>

                {/* Slots Count or Urgency badge */}
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black text-white whitespace-nowrap shadow-sm border border-slate-950 ${
                    isSelected
                      ? 'bg-[#20C933] text-slate-950 font-extrabold'
                      : isUrgent
                      ? 'bg-rose-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {story.offersCount > 1 ? `${story.offersCount} vagas` : `${story.minExpires}m`}
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold mt-1.5 max-w-[66px] truncate text-center leading-tight transition-colors font-['Poppins'] ${
                  isSelected
                    ? 'text-[#20C933] font-bold'
                    : 'text-slate-300 group-hover:text-white'
                }`}
              >
                {story.salonName}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
