import React, { useState, useMemo } from 'react';
import { MapPin, Search, ArrowUpDown, Compass } from 'lucide-react';
import { ServiceOffer } from '../types';
import { InstallBanner } from './InstallBanner';
import { RadarStoryBar } from './RadarStoryBar';
import { RadarStoryModal } from './RadarStoryModal';
import { RadarOfferCard } from './RadarOfferCard';
import { VagouLogo } from './VagouLogo';

interface HomeScreenProps {
  onNavigateToOffers: (query?: string, category?: string) => void;
  onNavigateToOfferDetail: (offer: ServiceOffer) => void;
  onNavigateToMap: () => void;
  offers: ServiceOffer[];
  onOpenInstallModal?: () => void;
  isStandalone?: boolean;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  onSwitchToPartnerMode?: () => void;
  onConfirmBooking?: (offer: ServiceOffer) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToOffers,
  onNavigateToOfferDetail,
  onNavigateToMap,
  offers,
  onOpenInstallModal,
  isStandalone = false,
  favorites = [],
  onToggleFavorite,
  onSwitchToPartnerMode,
  onConfirmBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'urgency' | 'distance' | 'price'>('urgency');

  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  const categories = [
    { id: 'todos', label: '🔥 Todas as Vagas' },
    { id: 'flash', label: '⚡ Relâmpago' },
    { id: 'cabelo', label: '✂️ Cabelo' },
    { id: 'barba', label: '🪒 Barba' },
    { id: 'unhas', label: '💅 Unhas' },
    { id: 'beleza', label: '✨ Sobrancelha' },
  ];

  const filteredAndSortedOffers = useMemo(() => {
    let list = [...offers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.salonName.toLowerCase().includes(q) ||
          o.serviceTitle.toLowerCase().includes(q) ||
          o.professionalName.toLowerCase().includes(q) ||
          o.neighborhood.toLowerCase().includes(q)
      );
    }

    if (selectedCategory === 'flash') {
      list = list.filter((o) => o.isFlashDeal);
    } else if (selectedCategory !== 'todos') {
      list = list.filter(
        (o) =>
          o.serviceCategory === selectedCategory ||
          (selectedCategory === 'beleza' &&
            (o.serviceCategory === 'beleza' || o.serviceCategory === 'estetica'))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'urgency') {
        const timeA = a.expiresInMinutes || 999;
        const timeB = b.expiresInMinutes || 999;
        return timeA - timeB;
      } else if (sortBy === 'distance') {
        const distA = a.distanceMeters || parseFloat(a.distance) * 1000 || 999;
        const distB = b.distanceMeters || parseFloat(b.distance) * 1000 || 999;
        return distA - distB;
      } else {
        return a.price - b.price;
      }
    });

    return list;
  }, [offers, searchQuery, selectedCategory, sortBy]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setIsStoryModalOpen(true);
  };

  const handleDirectBook = (offer: ServiceOffer) => {
    if (onConfirmBooking) {
      onConfirmBooking(offer);
    } else {
      onNavigateToOfferDetail(offer);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-slate-950 text-slate-100">
      {/* Single Unified Sticky Top Bar (Header + Search + Categories) */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-900 shadow-md">
        {/* Logo, Partner Switcher & Location */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center">
            <VagouLogo variant="header" size="sm" theme="dark" showTagline={false} />
          </div>

          <div className="flex items-center gap-1.5">
            {onSwitchToPartnerMode && (
              <button
                onClick={onSwitchToPartnerMode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 text-[11px] font-bold transition border border-emerald-500/40 shadow-sm"
                title="Acessar Painel do Estabelecimento"
              >
                <span>🏢 Sou Salão</span>
              </button>
            )}

            <button
              onClick={onNavigateToMap}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition border border-slate-800"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Itaquera</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar salão, corte, barba, unhas..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="px-4 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PWA Install Banner */}
      {onOpenInstallModal && (
        <div className="px-4 pt-2">
          <InstallBanner
            onOpenInstallModal={onOpenInstallModal}
            isStandalone={isStandalone}
          />
        </div>
      )}

      {/* Top Stories Bar */}
      <div className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-sm">
        <RadarStoryBar offers={offers} onSelectStory={handleOpenStory} />
      </div>

      {/* Feed Strip: Urgency & Sorting */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="font-extrabold text-white text-xs uppercase tracking-wider">
            {filteredAndSortedOffers.length} VAGAS DISPONÍVEIS AGORA
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-300">
          <ArrowUpDown className="w-3 h-3 text-emerald-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-[11px] text-slate-200 font-bold focus:outline-none cursor-pointer"
          >
            <option value="urgency" className="bg-slate-900 text-white">⚡ Mais Urgentes</option>
            <option value="distance" className="bg-slate-900 text-white">📍 Mais Próximos</option>
            <option value="price" className="bg-slate-900 text-white">🏷️ Menor Preço</option>
          </select>
        </div>
      </div>

      {/* Vertical Radar Feed */}
      <div className="px-4 space-y-4 mt-1">
        {filteredAndSortedOffers.length > 0 ? (
          filteredAndSortedOffers.map((offer, index) => (
            <RadarOfferCard
              key={offer.id}
              offer={offer}
              isFavorite={favorites.includes(offer.id)}
              onToggleFavorite={(id) => onToggleFavorite?.(id)}
              onSelectOffer={(off) => onNavigateToOfferDetail(off)}
              onDirectBook={handleDirectBook}
              onOpenStory={() => handleOpenStory(index)}
            />
          ))
        ) : (
          <div className="py-16 text-center px-6 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Compass className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhuma vaga encontrada</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tente selecionar outra categoria ou ampliar seu raio no mapa para ver horários abertos.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow"
            >
              Ver Todas as Vagas
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Story Viewer Modal */}
      <RadarStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        offers={filteredAndSortedOffers.length > 0 ? filteredAndSortedOffers : offers}
        initialIndex={activeStoryIndex}
        onConfirmBooking={handleDirectBook}
        onNavigateToDetail={(off) => onNavigateToOfferDetail(off)}
      />
    </div>
  );
};
