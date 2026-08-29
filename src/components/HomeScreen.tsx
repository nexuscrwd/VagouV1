import React from 'react';
import { Sparkles, MapPin, Search, Star, Clock } from 'lucide-react';
import { ServiceOffer } from '../types';
import { InstallBanner } from './InstallBanner';

interface HomeScreenProps {
  onNavigateToOffers: (query?: string, category?: string) => void;
  onNavigateToOfferDetail: (offer: ServiceOffer) => void;
  onNavigateToMap: () => void;
  offers: ServiceOffer[];
  onOpenInstallModal?: () => void;
  isStandalone?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToOffers,
  onNavigateToOfferDetail,
  onNavigateToMap,
  offers,
  onOpenInstallModal,
  isStandalone = false,
}) => {
  const featuredOffer = offers.find((o) => o.featured) || offers[0];
  const categories = [
    { id: 'beleza', label: 'Beleza', icon: '✨' },
    { id: 'cabelo', label: 'Cabelo', icon: '✂️' },
    { id: 'barba', label: 'Barba', icon: '🪒' },
    { id: 'unhas', label: 'Unhas', icon: '💅' },
  ];

  return (
    <div className="flex flex-col min-h-full pb-20 bg-white">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Bem-vindo(a)</span>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Olá, Anderson!</h1>
          </div>

          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Itaquera, SP</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="O que você procura?"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onNavigateToOffers((e.target as HTMLInputElement).value);
              }
            }}
            onClick={() => onNavigateToOffers()}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* PWA Install Banner */}
      {onOpenInstallModal && (
        <InstallBanner
          onOpenInstallModal={onOpenInstallModal}
          isStandalone={isStandalone}
        />
      )}

      {/* Categories Chips */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => onNavigateToOffers('', cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              idx === 0
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* VAGOU AGORA Section */}
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-black tracking-wider uppercase text-slate-900">VAGOU AGORA</h2>
            <span className="text-amber-500">⚡</span>
          </div>
          <button
            onClick={() => onNavigateToOffers()}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Ver todos
          </button>
        </div>

        {/* Main Featured Card */}
        {featuredOffer && (
          <div
            onClick={() => onNavigateToOfferDetail(featuredOffer)}
            className="border-2 border-emerald-500/40 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="relative h-36 bg-slate-200 overflow-hidden">
              <img
                src={featuredOffer.imageUrl}
                alt={featuredOffer.salonName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>{featuredOffer.timeSlot}</span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                    {featuredOffer.professionalName} Barbeiro – {featuredOffer.salonName}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{featuredOffer.serviceTitle}</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span>{featuredOffer.distance}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-800">{featuredOffer.rating}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900">
                    R${featuredOffer.price.toFixed(0)}
                  </span>
                </div>
                <button
                  id="btn-reservar-home"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToOfferDetail(featuredOffer);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-sm uppercase tracking-wide"
                >
                  RESERVAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Próximos de Você Section */}
      <div className="px-5 mt-5">
        <h2 className="text-xs font-bold text-slate-900 mb-3">Próximos de você</h2>
        <div className="grid grid-cols-2 gap-3">
          {offers.slice(1, 3).map((off) => (
            <div
              key={off.id}
              onClick={() => onNavigateToOfferDetail(off)}
              className="border border-slate-100 rounded-lg overflow-hidden bg-white hover:border-slate-300 transition cursor-pointer group"
            >
              <div className="h-20 bg-slate-100 relative">
                <img
                  src={off.imageUrl}
                  alt={off.salonName}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">{off.salonName}</h4>
                <p className="text-[10px] text-slate-500 truncate">{off.serviceTitle}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">R${off.price}</span>
                  <span className="text-[10px] font-semibold text-emerald-600">{off.timeSlot.split('•')[1] || off.timeSlot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
