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
  Sun,
  Moon,
} from 'lucide-react';
import { VagouLogo } from './VagouLogo';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className={`w-full max-w-xs h-full border-l flex flex-col justify-between shadow-2xl p-5 overflow-y-auto transition-colors duration-200 ${
        isDark ? 'bg-[#151A1E] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        {/* Top Header */}
        <div>
          <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <VagouLogo variant="header" size="xs" theme={isDark ? "dark" : "light"} />
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-xs'
              }`}
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className={`mt-4 p-3.5 rounded-2xl border flex items-center gap-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="relative">
              <img
                src={userAvatarUrl}
                alt={userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#20C933]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#20C933] flex items-center justify-center text-white">
                <UserCheck className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-black truncate font-['Poppins'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {userName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#087A2A] dark:text-[#20C933] font-bold bg-[#20C933]/15 px-2 py-0.5 rounded-full border border-[#20C933]/30">
                  Cliente VIP
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Quick Segment Switcher (Netflix Profiles) */}
          <div className="mt-5">
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 font-['Poppins'] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Perfil de Preferência (Feed)
            </span>
            <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800/90' : 'bg-slate-200/80 border-slate-300'
            }`}>
              <button
                onClick={() => onSelectSegment('barbearia')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 cursor-pointer ${
                  currentSegment === 'barbearia'
                    ? 'bg-[#20C933] text-white drop-shadow-xs shadow-sm font-black'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Barbearia</span>
                <span className="text-[9px] opacity-80 font-normal">Anderson</span>
              </button>

              <button
                onClick={() => onSelectSegment('salao')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 cursor-pointer ${
                  currentSegment === 'salao'
                    ? 'bg-[#20C933] text-white drop-shadow-xs shadow-sm font-black'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Salão</span>
                <span className="text-[9px] opacity-80 font-normal">Esposa</span>
              </button>

              <button
                onClick={() => onSelectSegment('todos')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex flex-col items-center gap-0.5 cursor-pointer ${
                  currentSegment === 'todos'
                    ? 'bg-[#20C933] text-white drop-shadow-xs shadow-sm font-black'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Geral</span>
                <span className="text-[9px] opacity-80 font-normal">Todas</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-5 space-y-2">
            {/* Botão de Alternar Tema (Claro / Escuro) */}
            <button
              onClick={toggleTheme}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition group cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isDark
                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/20'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isDark ? 'Tema Claro' : 'Tema Escuro'}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isDark ? 'Alternar para visual claro perolado' : 'Alternar para tema escuro slate'}
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isDark ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {isDark ? 'Ativar Claro' : 'Ativar Escuro'}
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToAgenda();
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition group cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-[#20C933] flex items-center justify-center border border-emerald-500/20">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Meus Agendamentos</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ver vagas confirmadas</span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
            </button>

            {onNavigateToFavorites && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFavorites();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition group cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-500/20">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Favoritos</span>
                      {favoriteCount !== undefined && favoriteCount > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold font-mono px-1.5 py-0.2 rounded-full border border-rose-500/30">
                          {favoriteCount}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Salões e serviços salvos</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition ${isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenInterestConfig();
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition group cursor-pointer ${
                isDark
                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Personalizar Categorias</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ajustar interesses do feed</span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
            </button>

            <button
              onClick={() => {
                onClose();
                onSwitchToPartnerMode();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-[#20C933]/30 text-left flex items-center justify-between transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#20C933] text-white flex items-center justify-center font-bold drop-shadow-xs">
                  <Building2 className="w-4 h-4 text-white" />
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
          <div className={`mt-4 pt-4 border-t space-y-1 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            {onOpenHelpModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHelpModal();
                }}
                className={`w-full py-2 px-3 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer ${
                  isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Como funciona o Vagou?</span>
              </button>
            )}

            <div className={`py-2 px-3 text-[11px] flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C933]" />
              <span>Agendamento Imediato Garantido</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`pt-4 border-t flex flex-col items-center text-center gap-1 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <VagouLogo variant="header" size="xs" theme={isDark ? "dark" : "light"} showTagline={false} />
          <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Vagou v1.2.0 • PWA Mobile
          </span>
        </div>
      </div>
    </div>
  );
};
