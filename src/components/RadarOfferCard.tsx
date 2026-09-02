import React, { useState, useRef } from 'react';
import { Heart, Volume2, VolumeX, Play, ChevronLeft, ChevronRight, Star, MapPin, Zap, Repeat, Eye } from 'lucide-react';
import { ServiceOffer } from '../types';
import { MediaFallbackCard } from './MediaFallbackCard';
import { CountdownTimer } from './CountdownTimer';
import { formatSlotDateTime } from '../utils/dateFormatter';

interface RadarOfferCardProps {
  offer: ServiceOffer;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectOffer: (offer: ServiceOffer) => void;
  onDirectBook: (offer: ServiceOffer) => void;
  onOpenStory?: () => void;
  onFilterBySalon?: (salonName: string) => void;
  onOpenSalonProfile?: (salonName: string) => void;
}

export const RadarOfferCard: React.FC<RadarOfferCardProps> = ({
  offer,
  isFavorite,
  onToggleFavorite,
  onSelectOffer,
  onDirectBook,
  onOpenStory,
  onFilterBySalon,
  onOpenSalonProfile,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaLevel = offer.mediaLevel || (offer.imageUrl ? 2 : 1);
  const gallery = offer.galleryImages && offer.galleryImages.length > 0
    ? offer.galleryImages
    : offer.imageUrl
    ? [offer.imageUrl]
    : [];

  // Swipe & Touch Gesture State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);
  const mouseDownX = useRef<number | null>(null);
  const isDraggingMouse = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    if (touchStartX.current && Math.abs(touchStartX.current - touchEndX.current) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30;

    if (Math.abs(distance) >= minSwipeDistance && gallery.length > 1) {
      if (distance > 0) {
        setCarouselIndex((prev) => (prev + 1) % gallery.length);
      } else {
        setCarouselIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    mouseDownX.current = e.clientX;
    isDraggingMouse.current = true;
    isSwiping.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMouse.current || mouseDownX.current === null) return;
    if (Math.abs(mouseDownX.current - e.clientX) > 10) {
      isSwiping.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingMouse.current || mouseDownX.current === null) return;
    const distance = mouseDownX.current - e.clientX;
    mouseDownX.current = null;
    isDraggingMouse.current = false;
    const minSwipeDistance = 30;

    if (Math.abs(distance) >= minSwipeDistance && gallery.length > 1) {
      if (distance > 0) {
        setCarouselIndex((prev) => (prev + 1) % gallery.length);
      } else {
        setCarouselIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    }
  };

  const handleMouseLeave = () => {
    isDraggingMouse.current = false;
    mouseDownX.current = null;
  };

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
      onClick={() => {
        if (isSwiping.current) return;
        onSelectOffer(offer);
      }}
      className="relative z-0 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg group hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
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
              className="absolute bottom-24 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition shadow-md cursor-pointer"
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : mediaLevel === 2 && gallery.length > 0 ? (
          /* LEVEL 2: Photo Carousel with Touch Swipe */
          <div
            className="relative w-full h-full overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {gallery.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${offer.serviceTitle} - ${idx + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              ))}
            </div>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevCarouselImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextCarouselImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
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
        <div className="absolute top-3 inset-x-3 z-10 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-black shadow-lg font-mono">
              <i className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
              <span>{formatSlotDateTime(offer.timeSlot)}</span>
              {offer.expiresInMinutes && (
                <span className="text-white/90 font-mono font-medium">
                  • {offer.expiresInMinutes}m
                </span>
              )}
            </span>

            {offer.isFlashDeal && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md w-fit">
                <Zap className="w-3 h-3 fill-white" />
                <span>Vaga Relâmpago {discountPercent ? `-${discountPercent}%` : ''}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {gallery.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-white/20 px-2.5 py-2 rounded-full shadow-md">
                {gallery.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === carouselIndex ? 'w-3 bg-emerald-400' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(offer.id);
              }}
              className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-md cursor-pointer"
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
            {/* Salon Name with click-to-profile action */}
            <div className="flex items-center gap-2">
              {/* Mini Avatar / Click to open profile */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSalonProfile) {
                    onOpenSalonProfile(offer.salonName);
                  } else if (onFilterBySalon) {
                    onFilterBySalon(offer.salonName);
                  }
                }}
                className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-emerald-400 flex-shrink-0 bg-slate-800 hover:ring-2 hover:ring-white transition cursor-pointer"
                title={`Ver perfil de ${offer.salonName}`}
              >
                {offer.professionalAvatar || offer.imageUrl ? (
                  <img
                    src={offer.professionalAvatar || offer.imageUrl}
                    alt={offer.salonName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-700 text-white text-[9px] font-bold flex items-center justify-center">
                    {offer.salonName.slice(0, 1)}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSalonProfile) {
                    onOpenSalonProfile(offer.salonName);
                  } else if (onFilterBySalon) {
                    onFilterBySalon(offer.salonName);
                  }
                }}
                className="text-[11px] font-bold uppercase tracking-wider text-[#20C933] hover:underline hover:text-emerald-300 transition-colors truncate text-left focus:outline-none cursor-pointer"
                title={`Ver perfil completo de ${offer.salonName}`}
              >
                {offer.salonName}
              </button>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] text-slate-300 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                {offer.distance}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate mt-1">
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
            <span className="text-lg sm:text-[20px] font-black text-emerald-400 font-mono leading-tight tracking-tight">
              <span>{formatSlotDateTime(offer.timeSlot)}</span>
            </span>

            <button
              id={`btn-radar-agendar-${offer.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDirectBook(offer);
              }}
              className="mt-1.5 px-3.5 py-1.5 bg-[#20C933] hover:bg-[#1bb32d] active:scale-95 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/30 uppercase tracking-wider flex items-center gap-1 font-['Poppins'] cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>AGENDAR • R${offer.price.toFixed(0)}</span>
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
