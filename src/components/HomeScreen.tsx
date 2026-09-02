import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Compass, Search } from 'lucide-react';
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
  onOpenProfileDrawer?: () => void;
  onOpenSearchModal?: () => void;
  currentSegment?: 'barbearia' | 'salao' | 'todos';
  onSelectSegment?: (segment: 'barbearia' | 'salao' | 'todos') => void;
  userName?: string;
  userAvatarUrl?: string;
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
  onOpenProfileDrawer,
  onOpenSearchModal,
  currentSegment = 'barbearia',
  onSelectSegment,
  userName = 'Anderson Silva',
  userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'urgency' | 'distance' | 'price'>('urgency');

  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  // Dynamic category tabs
  const categories = useMemo(() => {
    if (currentSegment === 'barbearia') {
      return [
        { id: 'todos', label: 'Todas as Vagas' },
        { id: 'flash', label: '⚡ Relâmpago' },
        { id: 'barba', label: 'Barba' },
        { id: 'cabelo', label: 'Corte Masculino' },
        { id: 'barba_corte', label: 'Barba + Corte' },
      ];
    }
    if (currentSegment === 'salao') {
      return [
        { id: 'todos', label: 'Todas as Vagas' },
        { id: 'flash', label: '⚡ Relâmpago' },
        { id: 'cabelo', label: 'Cabelo & Mechas' },
        { id: 'unhas', label: 'Unhas & Gel' },
        { id: 'beleza', label: 'Sobrancelha & Cílios' },
        { id: 'estetica', label: 'Estética Facial' },
      ];
    }
    return [
      { id: 'todos', label: 'Todas as Vagas' },
      { id: 'flash', label: '⚡ Relâmpago' },
      { id: 'barba', label: 'Barba' },
      { id: 'cabelo', label: 'Cabelo' },
      { id: 'unhas', label: 'Unhas' },
      { id: 'beleza', label: 'Sobrancelha' },
      { id: 'estetica', label: 'Estética' },
    ];
  }, [currentSegment]);

  const filteredAndSortedOffers = useMemo(() => {
    let list = [...offers];

    // Segment filter
    if (currentSegment === 'barbearia') {
      list = list.filter((o) => o.serviceCategory === 'barba' || o.serviceCategory === 'cabelo');
    } else if (currentSegment === 'salao') {
      list = list.filter(
        (o) =>
          o.serviceCategory === 'unhas' ||
          o.serviceCategory === 'beleza' ||
          o.serviceCategory === 'estetica' ||
          o.serviceCategory === 'cabelo'
      );
    }

    // Category filter
    if (selectedCategory === 'flash') {
      list = list.filter((o) => o.isFlashDeal || (o.expiresInMinutes && o.expiresInMinutes <= 30));
    } else if (selectedCategory === 'barba_corte') {
      list = list.filter(
        (o) =>
          o.serviceCategory === 'barba' ||
          o.serviceCategory === 'cabelo' ||
          o.serviceTitle.toLowerCase().includes('barba') ||
          o.serviceTitle.toLowerCase().includes('corte')
      );
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
  }, [offers, selectedCategory, sortBy, currentSegment]);

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
    <div className="pb-28 bg-slate-950 min-h-screen text-slate-100">
      {/* Fixed Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#151A1E] shadow-xl border-b border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <VagouLogo size="md" />
          </div>

          {/* Search Trigger Button & Profile */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              id="search-trigger-btn"
              onClick={onOpenSearchModal}
              className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-[#20C933] flex items-center justify-center transition-all shadow-sm active:scale-95 group"
              title="Buscar serviços ou salões"
            >
              <Search className="w-4 h-4 text-slate-300 group-hover:text-[#20C933] transition-colors" />
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfileDrawer}
              className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#20C933]/50 hover:ring-[#20C933] transition-all cursor-pointer flex-shrink-0"
              title="Meu Perfil & Configurações"
            >
              <img
                src={userAvatarUrl}
                alt={userName}
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#20C933] border-2 border-[#151A1E]" />
            </button>
          </div>
        </div>

        {/* Category Chips Bar with Integrated Sort Filter & Count Badge */}
        <div className="px-4 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const isAll = cat.id === 'todos';
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 font-['Poppins'] flex-shrink-0 ${
                  isActive
                    ? 'bg-[#20C933] text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                {isAll && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-slate-950 text-[#20C933]'
                        : 'bg-[#20C933]/20 text-[#20C933]'
                    }`}
                  >
                    {filteredAndSortedOffers.length}
                  </span>
                )}
              </button>
            );
          })}

          {/* Integrated Sort Selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-300 flex-shrink-0 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#20C933]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-[11px] text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
              title="Ordenar vagas"
            >
              <option value="urgency" className="bg-slate-900 text-white">⚡ Mais Urgentes</option>
              <option value="distance" className="bg-slate-900 text-white">📍 Mais Próximos</option>
              <option value="price" className="bg-slate-900 text-white">🏷️ Menor Preço</option>
            </select>
          </div>
        </div>

        {/* Top Stories Bar (Click opens fullscreen story viewer) */}
        <div className="border-t border-slate-900/90 bg-[#12161A]/90 backdrop-blur-sm">
          <RadarStoryBar offers={offers} onSelectStory={handleOpenStory} />
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

      {/* Vertical Radar Feed */}
      <div className="px-4 space-y-4 mt-3">
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
              <Compass className="w-8 h-8 text-[#20C933] animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white font-['Poppins']">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tente selecionar outra categoria ou mudar para o perfil geral para ver todos os horários abertos.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                onSelectSegment?.('todos');
              }}
              className="mt-4 px-4 py-2 bg-[#20C933] text-slate-950 text-xs font-black rounded-xl shadow"
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
