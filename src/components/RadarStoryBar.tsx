import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Video, Camera, Scissors, Check } from 'lucide-react';
import { ServiceOffer } from '../types';

interface SalonStoryGroup {
  salonName: string;
  professionalAvatar?: string;
  imageUrl?: string;
  mediaLevel: number;
  totalOffers: number;
  minExpiresInMinutes?: number;
  offers: ServiceOffer[];
}

interface RadarStoryBarProps {
  offers: ServiceOffer[];
  selectedSalonFilter?: string | null;
  onSelectSalon?: (salonName: string | null) => void;
  onOpenSalonProfile?: (salonName: string) => void;
}

export const RadarStoryBar: React.FC<RadarStoryBarProps> = ({
  offers,
  selectedSalonFilter = null,
  onSelectSalon,
  onOpenSalonProfile,
}) => {
  // Group offers by unique salon
  const salonGroups = useMemo(() => {
    const map = new Map<string, SalonStoryGroup>();

    offers.forEach((offer) => {
      const existing = map.get(offer.salonName);
      if (existing) {
        existing.totalOffers += 1;
        existing.offers.push(offer);
        if (offer.expiresInMinutes) {
          existing.minExpiresInMinutes = Math.min(
            existing.minExpiresInMinutes || 999,
            offer.expiresInMinutes
          );
        }
        if (offer.mediaLevel > existing.mediaLevel) {
          existing.mediaLevel = offer.mediaLevel;
        }
      } else {
        map.set(offer.salonName, {
          salonName: offer.salonName,
          professionalAvatar: offer.professionalAvatar,
          imageUrl: offer.imageUrl,
          mediaLevel: offer.mediaLevel || (offer.imageUrl ? 2 : 1),
          totalOffers: 1,
          minExpiresInMinutes: offer.expiresInMinutes,
          offers: [offer],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.minExpiresInMinutes || 999;
      const timeB = b.minExpiresInMinutes || 999;
      return timeA - timeB;
    });
  }, [offers]);

  return (
    <div className="w-full py-2.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5 min-w-max">
        {/* Radar Indicator / Reset Filter Button */}
        <button
          onClick={() => onSelectSalon?.(null)}
          className="flex flex-col items-center flex-shrink-0 group focus:outline-none cursor-pointer"
          title="Ver todos os salões e vagas"
        >
          <div
            className={`relative w-15 h-15 rounded-full p-0.5 transition-all duration-300 ${
              selectedSalonFilter === null
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 ring-2 ring-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-center p-1 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="text-emerald-400"
              >
                <Zap className="w-4 h-4 fill-emerald-400" />
              </motion.div>
              <span className="text-[8px] font-black tracking-tighter text-emerald-300 uppercase mt-0.5 font-['Poppins']">
                TODOS
              </span>
            </div>
            {selectedSalonFilter === null && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#20C933] border-2 border-[#12161A] flex items-center justify-center">
                <Check className="w-2 h-2 text-slate-950 stroke-[3]" />
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-black mt-1 uppercase tracking-tight font-['Poppins'] ${
              selectedSalonFilter === null ? 'text-[#20C933]' : 'text-slate-400'
            }`}
          >
            Geral
          </span>
        </button>

        {/* Stories Items Grouped by Salon */}
        {salonGroups.map((group) => {
          const isSelected = selectedSalonFilter === group.salonName;
          const isUrgent = (group.minExpiresInMinutes || 99) <= 20;
          const mediaTypeIcon =
            group.mediaLevel === 3 ? (
              <Video className="w-2.5 h-2.5 text-white" />
            ) : group.mediaLevel === 2 ? (
              <Camera className="w-2.5 h-2.5 text-white" />
            ) : (
              <Scissors className="w-2.5 h-2.5 text-white" />
            );

          return (
            <motion.button
              key={group.salonName}
              onClick={() => {
                if (onOpenSalonProfile) {
                  onOpenSalonProfile(group.salonName);
                } else if (onSelectSalon) {
                  onSelectSalon(isSelected ? null : group.salonName);
                }
              }}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center flex-shrink-0 group focus:outline-none transition-all duration-300 cursor-pointer ${
                selectedSalonFilter && !isSelected ? 'opacity-40 grayscale-[40%] hover:opacity-80' : 'opacity-100'
              }`}
            >
              <div
                className={`relative w-15 h-15 rounded-full p-[2px] transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-[#20C933] ring-offset-2 ring-offset-slate-950 scale-105 bg-[#20C933]'
                    : isUrgent
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-500'
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-slate-950 flex items-center justify-center relative">
                  {group.professionalAvatar || group.imageUrl ? (
                    <img
                      src={group.professionalAvatar || group.imageUrl}
                      alt={group.salonName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-950 flex items-center justify-center font-bold text-xs text-white">
                      {group.salonName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 h-4 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    {mediaTypeIcon}
                  </div>
                </div>

                {/* Number of open slots badge */}
                <div
                  className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black text-slate-950 whitespace-nowrap shadow-md border border-slate-900 ${
                    isSelected ? 'bg-white font-black' : 'bg-[#20C933]'
                  }`}
                  title={`${group.totalOffers} vagas abertas`}
                >
                  {group.totalOffers}v
                </div>

                {/* Countdown / Urgency badge */}
                {group.minExpiresInMinutes && (
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[8px] font-black text-white whitespace-nowrap shadow-sm border border-white/40 ${
                      isUrgent ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    {group.minExpiresInMinutes}m
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] font-semibold mt-1.5 max-w-[66px] truncate text-center leading-tight font-['Poppins'] ${
                  isSelected ? 'text-[#20C933] font-bold' : 'text-slate-300 group-hover:text-white'
                }`}
              >
                {group.salonName}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
