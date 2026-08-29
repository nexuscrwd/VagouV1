import React, { useState } from 'react';
import { ChevronRight, Calendar, Clock, Plus } from 'lucide-react';
import { BookingAppointment } from '../types';

interface AgendaScreenProps {
  bookings: BookingAppointment[];
  onNewBookingClick: () => void;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  bookings,
  onNewBookingClick,
}) => {
  const [tab, setTab] = useState<'proximos' | 'historico'>('proximos');

  const groups = [
    { title: 'HOJE, 26 DE JAN', items: bookings.filter((b) => b.dayGroup === 'HOJE, 26 DE JAN') },
    { title: 'AMANHÃ, 27 DE JAN', items: bookings.filter((b) => b.dayGroup === 'AMANHÃ, 27 DE JAN') },
  ];

  return (
    <div className="flex flex-col min-h-full pb-20 bg-white p-5">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900">Minha Agenda</h1>
        <button
          onClick={onNewBookingClick}
          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Nova</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="mt-4 p-1 bg-slate-100 rounded-lg flex">
        <button
          onClick={() => setTab('proximos')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            tab === 'proximos' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Próximos
        </button>
        <button
          onClick={() => setTab('historico')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            tab === 'historico' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* List Content */}
      <div className="mt-6 space-y-6">
        {groups.map((grp) =>
          grp.items.length > 0 ? (
            <div key={grp.title} className="space-y-2.5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {grp.title}
              </h3>

              <div className="space-y-2.5">
                {grp.items.map((item, idx) => (
                  <div
                    key={item.protocolCode + idx}
                    className={`border rounded-lg p-3.5 flex items-center justify-between transition cursor-pointer hover:shadow-md ${
                      item.status === 'EM ANDAMENTO'
                        ? 'border-emerald-500/60 bg-emerald-50/20 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Time Badge */}
                      <div className="text-center min-w-[50px] pr-3 border-r border-slate-100">
                        <span className="text-sm font-black text-slate-900 block">{item.time}</span>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {item.dayGroup.includes('HOJE') ? 'Hoje' : 'Amanhã'}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{item.service}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.salonName} • {item.professional}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              item.status === 'EM ANDAMENTO'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
