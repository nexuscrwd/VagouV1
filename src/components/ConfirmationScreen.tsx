import React from 'react';
import { Check, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { BookingAppointment } from '../types';

interface ConfirmationScreenProps {
  booking: BookingAppointment;
  onNavigateToAgenda: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  booking,
  onNavigateToAgenda,
}) => {
  return (
    <div className="flex flex-col min-h-full pb-20 bg-white p-5 justify-between">
      <div className="space-y-6 pt-4">
        {/* Check Success Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#20C933] text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-in zoom-in-75 duration-300">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-4 font-['Poppins']">Agendamento confirmado!</h1>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Sua vaga está garantida. Apresente o código abaixo ao chegar no estabelecimento.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4.5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500">Código Protocolo</span>
            <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {booking.protocolCode}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Serviço:</span>
              <span className="font-bold text-slate-900">{booking.service}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Profissional:</span>
              <span className="font-bold text-slate-900">{booking.professional}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Estabelecimento:</span>
              <span className="font-bold text-slate-900">{booking.salonName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Data / Hora:</span>
              <span className="font-bold text-slate-900">{booking.dateTime}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Total pago no local:</span>
            <span className="text-base font-black text-emerald-700">
              R$ {booking.totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 space-y-3">
        <button
          id="btn-ver-agenda-confirmacao"
          onClick={onNavigateToAgenda}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-xs rounded-lg transition shadow-md shadow-emerald-600/20 uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>VER AGENDA</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs font-medium">
          <MessageCircle className="w-4 h-4" />
          <span>Detalhes enviados por WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
