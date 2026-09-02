import React from 'react';
import {
  X,
  Calendar,
  Building2,
  Bell,
  SlidersHorizontal,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Heart,
} from 'lucide-react';
import { VagouLogo } from './VagouLogo';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAgenda: () => void;
  onNavigateToFavorites?: () => void;
  favoriteCount?: number;
  onSwitchToPartnerMode: () => void;
  onOpenInterestConfig: () => void;
  onOpenHelpModal?: () => void;
  currentSegment: string;
  onSelectSegment: (segment: 'barbearia' | 'salao' | 'todos') => void;
  userName?: string;
  userAvatarUrl?: string;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToAgenda,
  onNavigateToFavorites,
  favoriteCount,
  onSwitchToPartnerMode,
  onOpenInterestConfig,
  onOpenHelpModal,
  currentSegment,
  onSelectSegment,
  userName = 'Anderson Silva',
  userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-xs h-full bg-[#151A1E] border-l border-slate-800 text-white flex flex-col justify-between shadow-2xl p-5 overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <VagouLogo variant="header" size="xs" theme="dark" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="relative">
              <img
                src={userAvatarUrl}
                alt={userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#20C933]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#20C933] flex items-center justify-center text-slate-950">
                <UserCheck className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-white truncate font-['Poppins']">
                {userName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#20C933] font-bold bg-[#20C933]/10 px-2 py-0.5 rounded-full border border-[#20C933]/20">
                  Cliente VIP
                </span>
                <span className="text-[10px] text-slate-400">São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Quick Segment Switcher (Netflix Profiles) */}
          <div className="mt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-['Poppins']">
              Perfil de Preferência (Feed)
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/90">
              <button
                onClick={() => onSelectSegment('barbearia')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 ${
                  currentSegment === 'barbearia'
                    ? 'bg-[#20C933] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Barbearia</span>
                <span className="text-[9px] opacity-80 font-normal">Anderson</span>
              </button>

              <button
                onClick={() => onSelectSegment('salao')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 ${
                  currentSegment === 'salao'
                    ? 'bg-[#20C933] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Salão</span>
                <span className="text-[9px] opacity-80 font-normal">Esposa</span>
              </button>

              <button
                onClick={() => onSelectSegment('todos')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 ${
                  currentSegment === 'todos'
                    ? 'bg-[#20C933] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Geral</span>
                <span className="text-[9px] opacity-80 font-normal">Todas</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-5 space-y-1.5">
            <button
              onClick={() => {
                onClose();
                onNavigateToAgenda();
              }}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-[#20C933] flex items-center justify-center border border-emerald-500/20">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Meus Agendamentos</span>
                  <span className="text-[10px] text-slate-400">Ver vagas confirmadas</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            {onNavigateToFavorites && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFavorites();
                }}
                className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-500/20">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white block">Favoritos</span>
                      {favoriteCount !== undefined && favoriteCount > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold font-mono px-1.5 py-0.2 rounded-full border border-rose-500/30">
                          {favoriteCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Salões e serviços salvos</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenInterestConfig();
              }}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Personalizar Categorias</span>
                  <span className="text-[10px] text-slate-400">Ajustar interesses do feed</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            <button
              onClick={() => {
                onClose();
                onSwitchToPartnerMode();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-[#20C933]/30 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#20C933] text-slate-950 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">Painel do Estabelecimento</span>
                  <span className="text-[10px] text-[#20C933] font-medium">Sou Salão / Barbeiro</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#20C933]" />
            </button>
          </div>

          {/* Quick Help & Info */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1">
            {onOpenHelpModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHelpModal();
                }}
                className="w-full py-2 px-3 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2 transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Como funciona o Vagou?</span>
              </button>
            )}

            <div className="py-2 px-3 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C933]" />
              <span>Agendamento Imediato Garantido</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center text-center gap-1">
          <VagouLogo variant="header" size="xs" theme="dark" showTagline={false} />
          <span className="text-[10px] text-slate-500 font-medium">
            Vagou v1.2.0 • PWA Mobile
          </span>
        </div>
      </div>
    </div>
  );
};
