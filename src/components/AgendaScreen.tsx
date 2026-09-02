import React, { useState } from 'react';
import { ChevronRight, Calendar, Clock, Plus, Trash2, ArrowLeft, Home } from 'lucide-react';
import { BookingAppointment } from '../types';
import { CancelModal } from './CancelModal';

interface AgendaScreenProps {
  bookings: BookingAppointment[];
  onNewBookingClick: () => void;
  onCancelBooking: (protocolCode: string) => void;
  onBack?: () => void;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  bookings,
  onNewBookingClick,
  onCancelBooking,
  onBack,
}) => {
  const [tab, setTab] = useState<'proximos' | 'historico'>('proximos');
  const [bookingToCancel, setBookingToCancel] = useState<BookingAppointment | null>(null);

  const activeBookings = bookings.filter((b) => b.status !== 'CANCELADO');
  const pastOrCancelledBookings = bookings.filter((b) => b.status === 'CANCELADO');

  const displayedList = tab === 'proximos' ? activeBookings : pastOrCancelledBookings;

  const groups = [
    { title: 'HOJE, 26 DE JAN', items: displayedList.filter((b) => b.dayGroup.includes('HOJE')) },
    { title: 'AMANHÃ, 27 DE JAN', items: displayedList.filter((b) => b.dayGroup.includes('AMANHÃ')) },
    { title: 'OUTRAS DATAS', items: displayedList.filter((b) => !b.dayGroup.includes('HOJE') && !b.dayGroup.includes('AMANHÃ')) },
  ];

  const handleConfirmCancel = (booking: BookingAppointment) => {
    onCancelBooking(booking.protocolCode);
    setBookingToCancel(null);
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-white p-5">
      {/* Modal de confirmação de cancelamento */}
      <CancelModal
        isOpen={Boolean(bookingToCancel)}
        booking={bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Header Title with Back & Home */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="btn-voltar-agenda"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer active:scale-95"
              title="Voltar ao Início"
              aria-label="Voltar para a tela inicial"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-700" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black text-slate-900">Minha Agenda</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie e acompanhe seus horários</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95"
              title="Página Inicial (Radar)"
              aria-label="Ir para a página inicial"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onNewBookingClick}
            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1 text-xs font-bold cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Vaga</span>
          </button>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="mt-4 p-1 bg-slate-100 rounded-lg flex">
        <button
          onClick={() => setTab('proximos')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            tab === 'proximos' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Próximos ({activeBookings.length})
        </button>
        <button
          onClick={() => setTab('historico')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            tab === 'historico' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Histórico / Cancelados ({pastOrCancelledBookings.length})
        </button>
      </div>

      {/* List Content */}
      <div className="mt-6 space-y-6 flex-1">
        {displayedList.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {tab === 'proximos' ? 'Nenhum agendamento ativo' : 'Nenhum histórico'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {tab === 'proximos'
                ? 'Você não possui vagas agendadas no momento. Encontre vagas disponíveis agora!'
                : 'Seus serviços finalizados ou cancelados aparecerão aqui.'}
            </p>
            {tab === 'proximos' && (
              <button
                onClick={onNewBookingClick}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Buscar Vagas Agora
              </button>
            )}
          </div>
        ) : (
          groups.map((grp) =>
            grp.items.length > 0 ? (
              <div key={grp.title} className="space-y-2.5">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {grp.title}
                </h3>

                <div className="space-y-2.5">
                  {grp.items.map((item) => (
                    <div
                      key={item.protocolCode}
                      className={`border rounded-lg p-3.5 flex flex-col gap-3 transition shadow-sm ${
                        item.status === 'EM ANDAMENTO'
                          ? 'border-emerald-500/60 bg-emerald-50/20 ring-1 ring-emerald-500/20'
                          : item.status === 'CANCELADO'
                          ? 'border-slate-200 bg-slate-50 opacity-75'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Time Badge */}
                          <div className="text-center min-w-[50px] pr-3 border-r border-slate-100 shrink-0">
                            <span className="text-sm font-black text-slate-900 block">{item.time}</span>
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              {item.dayGroup.includes('HOJE') ? 'Hoje' : 'Amanhã'}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 truncate">{item.service}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {item.salonName} • {item.professional}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  item.status === 'EM ANDAMENTO'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : item.status === 'CANCELADO'
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                #{item.protocolCode}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-900 block">
                            R$ {item.totalPrice.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Cancel Button Action Bar (for non-cancelled bookings) */}
                      {item.status !== 'CANCELADO' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Cancelamento gratuito até 1h antes
                          </span>
                          <button
                            onClick={() => setBookingToCancel(item)}
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md text-[11px] font-bold flex items-center gap-1 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cancelar Vaga</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};
