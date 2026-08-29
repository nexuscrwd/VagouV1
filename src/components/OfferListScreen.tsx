import React, { useState } from 'react';
import { ArrowLeft, XCircle, SlidersHorizontal, Star, Clock } from 'lucide-react';
import { ServiceOffer } from '../types';

interface OfferListScreenProps {
  offers: ServiceOffer[];
  onBack: () => void;
  onSelectOffer: (offer: ServiceOffer) => void;
}

export const OfferListScreen: React.FC<OfferListScreenProps> = ({
  offers,
  onBack,
  onSelectOffer,
}) => {
  const [activeFilter, setActiveFilter] = useState<'distancia' | 'preco' | 'avaliacao' | 'todos'>('todos');

  const filteredOffers = [...offers].sort((a, b) => {
    if (activeFilter === 'preco') return a.price - b.price;
    if (activeFilter === 'avaliacao') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-full pb-20 bg-white">
      {/* Top Bar with Search Chip */}
      <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-lg px-3.5 py-2">
            <span className="text-xs font-bold text-slate-900">Corte masculino • Hoje</span>
            <button className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-4 h-4 fill-slate-300 text-white" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          <button className="p-2 bg-slate-100 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'distancia' ? 'todos' : 'distancia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              activeFilter === 'distancia' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Distância
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'preco' ? 'todos' : 'preco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              activeFilter === 'preco' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Preço
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'avaliacao' ? 'todos' : 'avaliacao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              activeFilter === 'avaliacao' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Avaliação
          </button>
        </div>
      </div>

      {/* Offers List */}
      <div className="p-4 space-y-3">
        {filteredOffers.map((off) => (
          <div
            key={off.id}
            onClick={() => onSelectOffer(off)}
            className="border border-slate-100 hover:border-emerald-500/40 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition cursor-pointer flex gap-3.5 group"
          >
            <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-100 shrink-0">
              <img
                src={off.imageUrl}
                alt={off.salonName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 truncate">{off.salonName}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{off.rating}</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{off.serviceTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Profissional: {off.professionalName} • {off.distance}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {off.timeSlot}
                </span>
                <span className="text-sm font-black text-slate-900">R$ {off.price.toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
