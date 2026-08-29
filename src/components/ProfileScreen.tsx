import React from 'react';
import { User, Phone, MapPin, Shield, CreditCard, Bell, ChevronRight, LogOut, Award } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full pb-20 bg-white p-5 space-y-5">
      <div className="flex items-center gap-3.5 pt-2">
        <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center font-black text-xl">
          A
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900">Anderson Silva</h2>
          <p className="text-xs text-slate-500 font-medium">+55 (11) 98765-4321</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Cliente VIP
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configurações da Conta</h3>
        
        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Endereços Salvos (Itaquera)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Formas de Pagamento no Local</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Notificações WhatsApp & Push</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-xs font-black text-white">Indique e Ganhe R$ 10</h4>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              Compartilhe o Vagou com amigos e ganhe desconto na próxima vaga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
