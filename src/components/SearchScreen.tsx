import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, SlidersHorizontal, ArrowUpDown, Compass, ArrowLeft, Home } from 'lucide-react';
import { ServiceOffer } from '../types';
import { RadarOfferCard } from './RadarOfferCard';
import { VagouLogo } from './VagouLogo';

interface SearchScreenProps {
  offers: ServiceOffer[];
  onSelectOffer: (offer: ServiceOffer) => void;
  onConfirmBooking: (offer: ServiceOffer) => void;
  onBack?: () => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  offers,
  onSelectOffer,
  onConfirmBooking,
  onBack,
  favorites = [],
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'urgency' | 'distance' | 'price'>('urgency');

  // Categories list without arbitrary emojis (only lightning bolt on flash deal)
  const categories = [
    { id: 'todos', label: 'Todas as Vagas' },
    { id: 'flash', label: '⚡ Relâmpago' },
    { id: 'barba', label: 'Barba' },
    { id: 'cabelo', label: 'Cabelo' },
    { id: 'unhas', label: 'Unhas & Gel' },
    { id: 'beleza', label: 'Sobrancelha & Cílios' },
    { id: 'estetica', label: 'Estética' },
  ];

  // Distinct neighborhoods
  const neighborhoods = useMemo(() => {
    const list = Array.from(new Set(offers.map((o) => o.neighborhood.split(',')[0].trim())));
    return ['todos', ...list];
  }, [offers]);

  const filteredOffers = useMemo(() => {
    let list = [...offers];

    if (query.trim()) {
      const q = query.toLowerCase();
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
          (selectedCategory === 'beleza' && (o.serviceCategory === 'beleza' || o.serviceCategory === 'estetica'))
      );
    }

    if (selectedNeighborhood !== 'todos') {
      list = list.filter((o) => o.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase()));
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
  }, [offers, query, selectedCategory, selectedNeighborhood, sortBy]);

  return (
    <div className="flex flex-col min-h-full pb-24 bg-slate-950 text-slate-100">
      {/* Sticky Top Search Header */}
      <div className="sticky top-0 z-40 bg-[#151A1E]/95 backdrop-blur-md border-b border-slate-900 shadow-md">
        <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                id="btn-voltar-busca"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-[#20C933] transition cursor-pointer active:scale-95"
                aria-label="Voltar para a tela anterior"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4 text-[#20C933]" />
                <span className="text-xs font-bold">Voltar</span>
              </button>
            )}
            <VagouLogo variant="header" size="xs" theme="dark" showTagline={false} />
            <span className="text-xs font-black text-white uppercase tracking-wider font-['Poppins']">
              • Buscar Vagas
            </span>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-[#20C933] hover:border-[#20C933] transition cursor-pointer active:scale-95"
              title="Ir para a Tela Inicial (Radar)"
              aria-label="Tela Inicial"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Input Box */}
        <div className="px-4 pb-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar serviço, profissional, salão ou bairro..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#20C933] focus:ring-1 focus:ring-[#20C933]"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories horizontal bar */}
        <div className="px-4 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#20C933] text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Neighborhood & Sort Filter Bar */}
        <div className="px-4 pb-2.5 flex items-center justify-between gap-2 text-xs border-t border-slate-900/80 pt-2">
          {/* Neighborhood filter */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            <MapPin className="w-3 h-3 text-[#20C933]" />
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="bg-transparent border-none text-[11px] text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-slate-900 text-white">Todos os Bairros</option>
              {neighborhoods.filter((n) => n !== 'todos').map((n) => (
                <option key={n} value={n} className="bg-slate-900 text-white">
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            <ArrowUpDown className="w-3 h-3 text-[#20C933]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-[11px] text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="urgency" className="bg-slate-900 text-white">⚡ Urgência</option>
              <option value="distance" className="bg-slate-900 text-white">📍 Distância</option>
              <option value="price" className="bg-slate-900 text-white">🏷️ Preço</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#20C933] inline-block" />
          <span className="font-extrabold text-white text-xs uppercase tracking-wider">
            {filteredOffers.length} RESULTADOS ENCONTRADOS
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="px-4 space-y-4 mt-1">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <RadarOfferCard
              key={offer.id}
              offer={offer}
              isFavorite={favorites.includes(offer.id)}
              onToggleFavorite={(id) => onToggleFavorite?.(id)}
              onSelectOffer={(off) => onSelectOffer(off)}
              onDirectBook={(off) => onConfirmBooking(off)}
            />
          ))
        ) : (
          <div className="py-16 text-center px-6 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Compass className="w-7 h-7 text-[#20C933]" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum resultado com esse filtro</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tente buscar por termos mais simples ou selecione "Todas as Vagas".
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('todos');
                setSelectedNeighborhood('todos');
              }}
              className="mt-4 px-4 py-2 bg-[#20C933] text-slate-950 text-xs font-black rounded-xl shadow"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
