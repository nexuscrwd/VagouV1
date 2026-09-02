import React from 'react';
import { ArrowLeft, Share2, Star, ShieldCheck, Clock, Calendar, CheckCircle2, Heart, Home } from 'lucide-react';
import { ServiceOffer } from '../types';

interface OfferDetailScreenProps {
  offer: ServiceOffer;
  onBack: () => void;
  onConfirmBooking: (offer: ServiceOffer) => void;
  onGoHome?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const OfferDetailScreen: React.FC<OfferDetailScreenProps> = ({
  offer,
  onBack,
  onConfirmBooking,
  onGoHome,
  isFavorite = false,
  onToggleFavorite,
}) => {
  return (
    <div className="flex flex-col min-h-full pb-20 bg-white">
      {/* Top Banner Image with Action Overlays */}
      <div className="relative h-64 bg-slate-900">
        <img
          src={offer.imageUrl}
          alt={offer.serviceTitle}
          className="w-full h-full object-cover opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              id="btn-voltar-detalhe-oferta"
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-slate-800 flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer active:scale-95"
              title="Voltar para a página anterior"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {onGoHome && (
              <button
                id="btn-inicio-detalhe-oferta"
                onClick={onGoHome}
                className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-slate-800 flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer active:scale-95"
                title="Ir para a Tela Inicial (Radar)"
                aria-label="Tela Inicial"
              >
                <Home className="w-5 h-5 text-slate-700" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(offer.id)}
                className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur text-slate-800 flex items-center justify-center shadow-md hover:bg-white transition"
                aria-label="Favoritar"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                  }`}
                />
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${offer.serviceTitle} no Vagou`,
                    text: `Vaga rápida em ${offer.salonName} por R$ ${offer.price}`,
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur text-slate-800 flex items-center justify-center shadow-md hover:bg-white transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Info Body */}
      <div className="p-5 -mt-6 bg-white rounded-t-xl relative z-10 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {offer.serviceTitle} com {offer.professionalName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-700">{offer.salonName}</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-800">{offer.rating}</span>
                <span className="text-[11px] text-slate-400">({offer.ratingCount} avaliações)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Distância: {offer.distance} • {offer.neighborhood}</p>
          </div>

          {/* Horário do Agendamento Section */}
          <div className="pt-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2">
              HORÁRIO DO AGENDAMENTO
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">DIA</span>
                <span className="text-xs font-black text-emerald-950 mt-0.5 block">{offer.dayLabel}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">HORÁRIO</span>
                <span className="text-xs font-black text-emerald-950 mt-0.5 block">
                  {offer.timeSlot.replace('Hoje • ', '').replace('Amanhã • ', '')}
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">DURAÇÃO</span>
                <span className="text-xs font-black text-emerald-950 mt-0.5 block">{offer.duration}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Horário programado: 14:30 às 15:15. Por favor, chegue com 5 min de antecedência.
            </p>
          </div>

          {/* Value & Protection */}
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Valor do serviço</span>
                <span className="text-2xl font-black text-slate-900">
                  R$ {offer.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#20C933]" />
                <span>Agendamento protegido</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA & Cancellation Policy */}
        <div className="pt-6 space-y-3">
          <button
            id="btn-agendar-agora"
            onClick={() => onConfirmBooking(offer)}
            className="w-full py-3.5 bg-[#20C933] hover:bg-[#1bb32d] active:scale-[0.99] text-slate-950 font-black text-sm rounded-xl transition shadow-md shadow-emerald-600/20 uppercase tracking-wider font-['Poppins']"
          >
            AGENDAR AGORA
          </button>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-700 uppercase">Regras de Cancelamento:</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cancelamento grátis até 1h antes do início do serviço. Após esse prazo, consulte as condições do estabelecimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
