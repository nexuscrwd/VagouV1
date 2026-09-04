import React from 'react';
import { Home, MapPin, Calendar, Search, Zap } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenSearchModal?: () => void;
  onSelectFlashCategory?: () => void;
  isFlashActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenSearchModal,
  onSelectFlashCategory,
  isFlashActive = false,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'busca' as ScreenId, label: 'Busca', icon: Search, isAction: true },
    { id: 'flash' as any, label: 'Relâmpago', icon: Zap, isFlash: true },
    { id: 'mapa' as ScreenId, label: 'Mapa', icon: MapPin },
    { id: 'agenda' as ScreenId, label: 'Agenda', icon: Calendar },
  ];

  const handleTabClick = (tabId: string, isAction?: boolean, isFlash?: boolean) => {
    if (isFlash) {
      if (onSelectFlashCategory) {
        onSelectFlashCategory();
      }
      return;
    }
    if (isAction && tabId === 'busca') {
      if (onOpenSearchModal) {
        onOpenSearchModal();
      }
      return;
    }
    onSelectScreen(tabId as ScreenId);
  };

  return (
    <nav className="flex-shrink-0 w-full h-16 bg-[#151A1E]/95 backdrop-blur-md border-t border-slate-800/90 px-3 flex items-center justify-around z-30 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isFlash = tab.isFlash;
        const isActive =
          (!isFlash && !tab.isAction && (
            (currentScreen === tab.id && !(tab.id === 'home' && isFlashActive)) ||
            (tab.id === 'home' && currentScreen === 'lista-ofertas' && !isFlashActive) ||
            (tab.id === 'home' && currentScreen === 'detalhe-oferta' && !isFlashActive) ||
            (tab.id === 'agenda' && currentScreen === 'confirmacao')
          )) ||
          (isFlash && isFlashActive);

        return (
          <button
            key={tab.id}
            id={isFlash ? "nav-flash-btn" : `nav-${tab.id}`}
            onClick={() => handleTabClick(tab.id, tab.isAction, tab.isFlash)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 transition active:scale-95 cursor-pointer group"
          >
            <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shadow-lg transition-transform ${
              isActive
                ? 'bg-emerald-950/80 border border-[#20C933]/60 text-[#20C933] scale-105 shadow-[0_0_12px_rgba(32,201,51,0.25)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}>
              {isFlash ? (
                <span className="text-lg">⚡</span>
              ) : (
                <Icon className="w-5 h-5 stroke-[2.2]" />
              )}
            </div>
            <span className={`text-[10px] tracking-wide font-['Poppins'] font-black ${
              isActive ? 'text-[#20C933]' : 'text-slate-400'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
