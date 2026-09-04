import React, { useState, useRef } from 'react';
import { Heart, Volume2, VolumeX, Zap, ChevronRight, Compass } from 'lucide-react';
import { ServiceOffer } from '../types';
import { MediaFallbackCard } from './MediaFallbackCard';
import { formatSlotDateTime } from '../utils/dateFormatter';

interface RadarFullscreenFeedProps {
  offers: ServiceOffer[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectOffer: (offer: ServiceOffer) => void;
  onDirectBook: (offer: ServiceOffer) => void;
  onOpenSalonProfile: (salonName: string) => void;
}

export const RadarFullscreenFeed: React.FC<RadarFullscreenFeedProps> = ({
  offers,
  favorites,
  onToggleFavorite,
  onSelectOffer,
  onDirectBook,
  onOpenSalonProfile,
}) => {
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const toggleMute = (offerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedStates((prev) => {
      const next = !prev[offerId];
      if (videoRefs.current[offerId]) {
        videoRefs.current[offerId]!.muted = next;
      }
      return { ...prev, [offerId]: next };
    });
  };

  if (offers.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-[#20C933] animate-spin mb-3" />
        <h3 className="text-base font-bold text-white">Nenhuma vaga ativa no momento</h3>
        <p className="text-xs text-slate-400 mt-1">Tente trocar a categoria no topo.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar bg-black">
      {offers.map((offer) => {
        const isFavorite = favorites.includes(offer.id);
        const isMuted = mutedStates[offer.id] ?? true;
        const hasVideo = offer.mediaLevel === 3 && !!offer.videoUrl;

        return (
          <div
            key={offer.id}
            className="h-full w-full snap-start relative flex flex-col justify-between overflow-hidden select-none bg-slate-950"
            onClick={() => onSelectOffer(offer)}
          >
            {/* Background Media: Video, Fallback ou Imagem Fullscreen */}
            <div className="absolute inset-0 z-0">
              {hasVideo ? (
                <video
                  ref={(el) => {
                    videoRefs.current[offer.id] = el;
                  }}
                  src={offer.videoUrl}
                  poster={offer.imageUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : offer.mediaLevel === 1 ? (
                <MediaFallbackCard offer={offer} size="full" />
              ) : (
                <img
                  src={offer.imageUrl}
                  alt={offer.serviceTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Degradê superior para legibilidade do cabeçalho */}
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Degradê inferior para legibilidade das ações */}
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
            </div>

            {/* Top Bar: Identificação do Estabelecimento */}
            <div className="relative z-10 px-4 pt-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSalonProfile(offer.salonName);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 hover:bg-black/75 transition cursor-pointer"
                  >
                    <span className="truncate max-w-[170px]">{offer.salonName}</span>
                    <ChevronRight className="w-3 h-3 text-[#20C933] shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(offer.id);
                    }}
                    className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 hover:bg-white/20 active:scale-90 transition cursor-pointer"
                    aria-label="Favoritar"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                <h2 className="text-base sm:text-lg font-black text-white mt-1.5 drop-shadow leading-tight">
                  {offer.serviceTitle}
                </h2>
                <p className="text-xs text-slate-200 drop-shadow mt-0.5">
                  Com <strong className="text-white">{offer.professionalName}</strong>
                </p>
              </div>

              {/* Tag de Urgência no Topo Direito */}
              {offer.expiresInMinutes && offer.expiresInMinutes <= 60 && (
                <div className="bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase shadow-lg flex items-center gap-1 border border-rose-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{offer.expiresInMinutes} min</span>
                </div>
              )}
            </div>

            {/* Bottom Actions: Agendamento no polegar esquerdo e som no direito */}
            <div className="relative z-10 px-4 pb-4 flex items-end justify-between gap-3">
              {/* Canto Inferior Esquerdo (Polegar) */}
              <div className="flex flex-col items-start gap-1.5">
                <span className="text-xs font-black text-[#20C933] font-mono tracking-tight bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#20C933]/30 leading-none">
                  {formatSlotDateTime(offer.timeSlot)}
                </span>

                <button
                  id={`btn-fullscreen-agendar-${offer.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDirectBook(offer);
                  }}
                  className="h-9 px-4 bg-[#20C933] hover:bg-[#1bb32d] active:scale-95 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5 font-['Poppins'] cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>AGENDAR • R${offer.price.toFixed(0)}</span>
                </button>
              </div>

              {/* Canto Inferior Direito: Controle de Som em vídeos */}
              {hasVideo && (
                <button
                  type="button"
                  onClick={(e) => toggleMute(offer.id, e)}
                  className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 active:scale-90 transition shadow-lg cursor-pointer"
                  aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
