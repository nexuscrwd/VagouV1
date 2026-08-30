import React from 'react';
import { Calendar, Zap, Clock, Building2 } from 'lucide-react';
import { PartnerScreenId } from '../types';

interface PartnerBottomNavProps {
  currentScreen: PartnerScreenId;
  onSelectScreen: (screen: PartnerScreenId) => void;
}

export const PartnerBottomNav: React.FC<PartnerBottomNavProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 z-40 px-3 py-1.5 shadow-lg">
      <div className="grid grid-cols-4 items-center">
        {/* Agenda */}
        <button
          id="partner-tab-agenda"
          onClick={() => onSelectScreen('partner-agenda')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            currentScreen === 'partner-agenda'
              ? 'text-emerald-600 font-black'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Agenda</span>
        </button>

        {/* Publicar Vaga Relâmpago */}
        <button
          id="partner-tab-publish"
          onClick={() => onSelectScreen('partner-publish')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            currentScreen === 'partner-publish'
              ? 'text-emerald-600 font-black'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Zap className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] mt-1">Publicar</span>
        </button>

        {/* Horários & Equipe */}
        <button
          id="partner-tab-config"
          onClick={() => onSelectScreen('partner-schedule-config')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            currentScreen === 'partner-schedule-config'
              ? 'text-emerald-600 font-black'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-1">Horários</span>
        </button>

        {/* Meu Salão / Perfil */}
        <button
          id="partner-tab-profile"
          onClick={() => onSelectScreen('partner-profile')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            currentScreen === 'partner-profile'
              ? 'text-emerald-600 font-black'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-1">Meu Salão</span>
        </button>
      </div>
    </div>
  );
};
