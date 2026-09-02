import React, { useState, useEffect } from 'react';
import { Search, Scissors, Star, Navigation, Heart, ArrowLeft, Home } from 'lucide-react';
import { ServiceOffer } from '../types';
import { MapSkeleton } from './SkeletonLoader';
import { formatSlotDateTime } from '../utils/dateFormatter';

interface MapScreenProps {
  offers: ServiceOffer[];
  onSelectOffer: (offer: ServiceOffer) => void;
  onBack?: () => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  offers,
  onSelectOffer,
  onBack,
  favorites = [],
  onToggleFavorite,
}) => {
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer>(offers[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="relative w-full h-[700px] bg-[#d9ebd9] overflow-hidden flex flex-col justify-between select-none">
      {/* Stylized Vector Map Canvas */}
      <div className="absolute inset-0 bg-[#e5f0e5] pointer-events-none">
        {/* Abstract Roads & Blocks */}
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c2dec2" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main Avenues */}
          <path d="M -20 150 Q 150 200 420 180" stroke="#ffffff" strokeWidth="14" fill="none" />
          <path d="M 80 -20 L 140 750" stroke="#ffffff" strokeWidth="12" fill="none" />
          <path d="M 280 -20 L 220 750" stroke="#ffffff" strokeWidth="16" fill="none" />
          <path d="M -20 420 Q 200 390 420 460" stroke="#ffffff" strokeWidth="18" fill="none" />
          
          {/* Secondary streets */}
          <path d="M 0 300 L 400 300" stroke="#ffffff" strokeWidth="6" fill="none" strokeDasharray="4 2" />
          <path d="M 30 550 L 380 520" stroke="#ffffff" strokeWidth="8" fill="none" />
        </svg>

        {/* Green Zones / Parks */}
        <div className="absolute top-28 left-8 w-24 h-32 bg-emerald-200/50 rounded-2xl -rotate-12" />
        <div className="absolute top-80 right-6 w-32 h-40 bg-emerald-200/40 rounded-3xl" />
      </div>

      {/* Top Floating Search Bar with Back & Home */}
      <div className="relative z-10 p-4 pt-4">
        <div className="bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-2 border border-slate-100">
          {onBack && (
            <button
              id="btn-voltar-mapa"
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center gap-1 active:scale-95"
              aria-label="Voltar para a tela anterior"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
            </button>
          )}
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 flex-1 truncate">Vagas no Mapa perto de mim</span>
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-600 transition cursor-pointer active:scale-95"
              title="Ir para a Tela Inicial (Radar)"
              aria-label="Tela Inicial"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Map Interactive Pins */}
      <div className="relative z-10 flex-1">
        {/* Pin 1 - Selected */}
        <button
          onClick={() => setSelectedOffer(offers[0])}
          className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition transform hover:scale-110 active:scale-95"
        >
          <div className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-lg flex items-center gap-1 border-2 border-white ring-4 ring-emerald-500/20">
            <span>R$45</span>
          </div>
          <div className="w-2 h-2 bg-emerald-700 rotate-45 -mt-1" />
        </button>

        {/* Pin 2 */}
        <button
          onClick={() => setSelectedOffer(offers[1])}
          className="absolute top-[32%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition transform hover:scale-110"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
            <Scissors className="w-4 h-4" />
          </div>
        </button>

        {/* Pin 3 */}
        <button
          onClick={() => setSelectedOffer(offers[2])}
          className="absolute top-[58%] left-[72%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition transform hover:scale-110"
        >
          <div className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[11px] font-bold shadow-md border-2 border-white">
            <span>R$35</span>
          </div>
        </button>
      </div>

      {/* Bottom Floating Info Card Sheet */}
      <div className="relative z-10 p-4 pb-20">
        <div className="bg-white rounded-lg p-4 shadow-xl border border-slate-100 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0">
              <img
                src={selectedOffer.imageUrl}
                alt={selectedOffer.salonName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 truncate">{selectedOffer.salonName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{selectedOffer.rating}</span>
                  </div>
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(selectedOffer.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(selectedOffer.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedOffer.serviceTitle} • <span className="font-semibold">{selectedOffer.professionalName}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatSlotDateTime(selectedOffer.timeSlot)} • {selectedOffer.distance}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-base font-black text-slate-900">
                R$ {selectedOffer.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              id="btn-ver-oferta-mapa"
              onClick={() => onSelectOffer(selectedOffer)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm uppercase tracking-wide"
            >
              VER OFERTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
