import React from 'react';
import {
  User,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Bell,
  ChevronRight,
  LogOut,
  Award,
  Download,
  Smartphone,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ProfileScreenProps {
  onInstallClick?: () => void;
  isInstallable?: boolean;
  isStandalone?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onInstallClick,
  isInstallable = true,
  isStandalone = false,
}) => {
  return (
    <div className="flex flex-col min-h-full pb-24 bg-white p-5 space-y-5">
      {/* User Header */}
      <div className="flex items-center gap-3.5 pt-2">
        <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center font-black text-xl shadow-sm">
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

      {/* PWA Install Banner */}
      {!isStandalone && (
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-white">Instalar o Vagou no Celular</h4>
              <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                Acesse horários imediatos mais rápido direto da sua tela inicial, sem barra do navegador.
              </p>
            </div>
          </div>
          <button
            onClick={onInstallClick}
            className="w-full py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Instalar Aplicativo Agora</span>
          </button>
        </div>
      )}

      {isStandalone && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">
            Você está usando o app Vagou instalado no celular!
          </div>
        </div>
      )}

      {/* Settings List */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configurações da Conta</h3>
        
        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Endereços Salvos (Itaquera, SP)</span>
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

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Privacidade & Termos de Uso</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Refer & Earn */}
      <div className="pt-1">
        <div className="bg-[#151A1E] text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div className="flex-1">
            <h4 className="text-xs font-black text-white">Indique e Ganhe R$ 10</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Compartilhe o Vagou com amigos e ganhe desconto na próxima vaga.
            </p>
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Vagou - Vagas Imediatas',
                  text: 'Agende vagas e horários imediatos em salões e barbearias!',
                  url: window.location.origin,
                }).catch(() => {});
              }
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-2 text-center">
        <span className="text-[11px] text-slate-400">Vagou App v1.0.0 • PWA Mobile</span>
      </div>
    </div>
  );
};
