import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scissors, Eye, Star, MapPin } from 'lucide-react';
import { ServiceOffer } from '../types';

interface MediaFallbackCardProps {
  offer: ServiceOffer;
  isStoryMode?: boolean;
}

export const MediaFallbackCard: React.FC<MediaFallbackCardProps> = ({ offer }) => {
  const category = offer.serviceCategory || 'cabelo';

  const getCategoryIllustration = () => {
    switch (category) {
      case 'cabelo':
        return (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, -15, 0, 15, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-xl"
            >
              <Scissors className="w-10 h-10 text-emerald-300 transform -rotate-45" />
            </motion.div>
            <motion.div
              animate={{ y: [-6, 6, -6], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 text-amber-300"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>
        );

      case 'barba':
        return (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-xl"
            >
              <span className="text-3xl">🪒</span>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -left-2 text-amber-200"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </div>
        );

      case 'unhas':
        return (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-400/30 flex items-center justify-center text-pink-300 shadow-xl"
            >
              <span className="text-3xl">💅</span>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 -right-2 text-pink-200"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>
        );

      case 'beleza':
      case 'estetica':
      default:
        return (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-xl"
            >
              <Eye className="w-10 h-10 text-purple-300" />
            </motion.div>
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -left-2 text-purple-200"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>
        );
    }
  };

  const gradientClass = offer.brandGradient || 'from-slate-950 via-slate-900 to-zinc-950';

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-between p-6 text-white overflow-hidden select-none`}>
      {/* Background Pulsing Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-emerald-500/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [20, -20, 20], y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl"
        />
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xs text-white">
            {offer.salonName.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Salão Verificado
            </span>
            <h4 className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">
              {offer.salonName}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-bold text-amber-300">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{offer.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Center Illustration */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 py-2">
        {getCategoryIllustration()}

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xl sm:text-2xl font-black text-white tracking-tight leading-tight"
        >
          {offer.serviceTitle}
        </motion.h3>

        <p className="mt-1 text-xs text-slate-300/90 max-w-[240px] line-clamp-2">
          {offer.description || `Com ${offer.professionalName} no ${offer.salonName}`}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-medium text-slate-200">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{offer.neighborhood} • {offer.distance}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          Vaga Imediata no Radar
        </span>
        <span className="text-[10px] text-slate-400">
          {offer.duration} de atendimento
        </span>
      </div>
    </div>
  );
};
