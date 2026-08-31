import React, { useState, useRef } from 'react';
import { Heart, Volume2, VolumeX, Play, ChevronLeft, ChevronRight, Star, MapPin, Sparkles, Zap, Repeat, Eye } from 'lucide-react';
import { ServiceOffer } from '../types';
import { MediaFallbackCard } from './MediaFallbackCard';
import { CountdownTimer } from './CountdownTimer';

interface RadarOfferCardProps {
  offer: ServiceOffer;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectOffer: (offer: ServiceOffer) => void;
  onDirectBook: (offer: ServiceOffer) => void;
  onOpenStory?: () => void;
}

export const RadarOfferCard: React.FC<RadarOfferCardProps> = ({
  offer,
  isFavorite,
  onToggleFavorite,
  onSelectOffer,
  onDirectBook,
  onOpenStory,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaLevel = offer.mediaLevel || (offer.imageUrl ? 2 : 1);
  const gallery = offer.galleryImages || (offer.imageUrl ? [offer.imageUrl] : []);

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const nextCarouselImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gallery.length > 1) {
      setCarouselIndex((prev) => (prev + 1) % gallery.length);
    }
  };

  const prevCarouselImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gallery.length > 1) {
      setCarouselIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    }
  };

  const discountPercent =
    offer.originalPrice && offer.originalPrice > offer.price
      ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)
      : null;

  return (
    <div
      onClick={() => onSelectOffer(offer)}
      className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg group hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
    >
      {/* Media Canvas Container */}
      <div className="relative w-full h-[390px] sm:h-[440px] bg-slate-950 overflow-hidden">
        {/* LEVEL 3: Video */}
        {mediaLevel === 3 && offer.videoUrl ? (
          <div className="relative w-full h-full" onClick={toggleVideoPlayback}>
            <video
              ref={videoRef}
              src={offer.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-24 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition shadow-md"
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : mediaLevel === 2 && gallery.length > 0 ? (
          /* LEVEL 2: Photo Carousel */
          <div className="relative w-full h-full">
            <img
              src={gallery[carouselIndex]}
              alt={offer.serviceTitle}
              className="w-full h-full object-cover transition-all duration-500"
              referrerPolicy="no-referrer"
            />

            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevCarouselImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextCarouselImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="absolute top-16 right-4 z-20 flex gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  {gallery.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === carouselIndex ? 'bg-emerald-400 w-3' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* LEVEL 1: Fallback Universal */
          <div className="relative w-full h-full">
            <MediaFallbackCard offer={offer} />
          </div>
        )}

        {/* Top Badges & Actions */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-black shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>VAGA AGORA</span>
              {offer.expiresInMinutes && (
                <span className="text-white/90 font-mono font-medium">
                  • {offer.expiresInMinutes}m
                </span>
              )}
            </div>

            {offer.isFlashDeal && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md w-fit">
                <Zap className="w-3 h-3 fill-white" />
                <span>Vaga Relâmpago {discountPercent ? `-${discountPercent}%` : ''}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenStory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStory();
                }}
                className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-slate-900 transition shadow-md"
                title="Abrir em Tela Cheia (Story)"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(offer.id);
              }}
              className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-md"
              aria-label="Favoritar"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />

        {/* Social Proof & Recurring Overlay */}
        <div className="absolute bottom-24 left-3.5 z-20 flex flex-wrap gap-1.5">
          {offer.activeViewers && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-200">
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>{offer.activeViewers} pessoas vendo agora</span>
            </div>
          )}

          {offer.isRecurring && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
              <Repeat className="w-3 h-3 text-emerald-400" />
              <span>Você já frequentou ({offer.recurringCount || 2}x)</span>
            </div>
          )}
        </div>

        {/* Bottom Bar Info & Action */}
        <div className="absolute bottom-3 inset-x-3.5 z-20 flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 truncate">
                {offer.salonName}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] text-slate-300 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                {offer.distance}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate mt-0.5">
              {offer.serviceTitle}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-slate-300 font-medium">
                Com <strong className="text-white">{offer.professionalName}</strong>
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[11px] text-amber-300 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {offer.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            {offer.originalPrice && offer.originalPrice > offer.price && (
              <span className="text-[11px] text-slate-400 line-through leading-none">
                R${offer.originalPrice.toFixed(0)}
              </span>
            )}
            <span className="text-lg sm:text-xl font-black text-emerald-400 leading-tight">
              R${offer.price.toFixed(0)}
            </span>

            <button
              id={`btn-radar-reservar-${offer.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDirectBook(offer);
              }}
              className="mt-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/30 uppercase tracking-wider flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>RESERVAR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Countdown Progress Bottom Strip */}
      <div className="px-3.5 py-2.5 bg-slate-950 border-t border-slate-800/80">
        <CountdownTimer
          initialMinutes={offer.expiresInMinutes || 25}
          expiresTimestamp={offer.expiresTimestamp}
        />
      </div>
    </div>
  );
};
