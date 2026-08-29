import React from 'react';
import { Home, MapPin, Calendar, User } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'mapa' as ScreenId, label: 'Mapa', icon: MapPin },
    { id: 'agenda' as ScreenId, label: 'Agenda', icon: Calendar },
    { id: 'perfil' as ScreenId, label: 'Perfil', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur border-t border-slate-200/80 px-4 flex items-center justify-around z-30">
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
            onClick={() => onSelectScreen(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition ${
              isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
