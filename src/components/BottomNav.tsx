import React from 'react';
import { Radio, Sparkles, MapPin, Calendar } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenSearchModal?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenSearchModal,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Radar', icon: Radio },
    { id: 'busca' as ScreenId, label: 'Inspirar', icon: Sparkles },
    { id: 'mapa' as ScreenId, label: 'Mapa', icon: MapPin },
    { id: 'agenda' as ScreenId, label: 'Agenda', icon: Calendar },
  ];

  const handleTabClick = (tabId: ScreenId) => {
    onSelectScreen(tabId);
  };

  return (
    <nav className="flex-shrink-0 w-full h-16 bg-[#151A1E]/95 backdrop-blur-md border-t border-slate-800/90 px-4 flex items-center justify-around z-30 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentScreen === tab.id ||
          (tab.id === 'home' && currentScreen === 'lista-ofertas') ||
          (tab.id === 'home' && currentScreen === 'detalhe-oferta') ||
          (tab.id === 'agenda' && currentScreen === 'confirmacao');

        return (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 transition active:scale-95 ${
              isActive ? 'text-[#20C933]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.id === 'home' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#20C933] animate-pulse" />
              )}
            </div>
            <span
              className={`text-[10px] tracking-wide font-['Poppins'] ${
                isActive ? 'font-black text-[#20C933]' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
