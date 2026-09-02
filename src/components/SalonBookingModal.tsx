import React, { useState, useMemo } from 'react';
import { 
  X, Calendar, Clock, User, CheckCircle2, ChevronLeft, ChevronRight, 
  Sparkles, Star, MapPin, ShieldCheck, Scissors, AlertCircle
} from 'lucide-react';
import { ServiceOffer } from '../types';

export interface CatalogServiceItem {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  category: string;
}

export interface SalonProfessionalItem {
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

interface SalonBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  salonAddress?: string;
  services: CatalogServiceItem[];
  professionals: SalonProfessionalItem[];
  initialService?: CatalogServiceItem | null;
  baseOffer?: ServiceOffer;
  onConfirmAppointment: (bookingData: {
    service: CatalogServiceItem;
    professional: string;
    professionalAvatar?: string;
    dateIso: string;
    dateFormatted: string;
    timeSlot: string;
    salonName: string;
    salonAddress: string;
    price: number;
  }) => void;
}

export const SalonBookingModal: React.FC<SalonBookingModalProps> = ({
  isOpen,
  onClose,
  salonName,
  salonAddress = 'Rua das Flores, 1420 - Centro, Curitiba, PR',
  services,
  professionals,
  initialService,
  baseOffer,
  onConfirmAppointment,
}) => {
  // 1. Service Selection State
  const [selectedService, setSelectedService] = useState<CatalogServiceItem>(
    initialService || services[0] || {
      id: 'srv-1',
      title: 'Corte Degradê / Fade Moderno',
      duration: '40 min',
      price: 55,
      description: 'Corte com acabamento preciso na lâmina',
      category: 'Cabelo',
    }
  );

  // 2. Professional Selection State ('any' or professional name)
  const [selectedProfessional, setSelectedProfessional] = useState<string>('any');

  // 3. Date Selection State (Restricted to Max 2 months / 60 days)
  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60); // Maximum 2 months / 60 days
    return d;
  }, []);

  // Generate day options for the next 60 days
  const availableDays = useMemo(() => {
    const days: Array<{
      date: Date;
      isoString: string;
      dayOfWeekName: string;
      dayOfMonth: number;
      monthName: string;
      isToday: boolean;
      isOpen: boolean;
    }> = [];

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    for (let i = 0; i <= 60; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      
      // Domingos (dayOfWeek === 0) geralmente salões estão fechados
      const isOpen = dayOfWeek !== 0;

      days.push({
        date: d,
        isoString: d.toISOString().split('T')[0],
        dayOfWeekName: weekDays[dayOfWeek],
        dayOfMonth: d.getDate(),
        monthName: months[d.getMonth()],
        isToday: i === 0,
        isOpen,
      });
    }

    return days;
  }, [today]);

  const [selectedDateIso, setSelectedDateIso] = useState<string>(
    availableDays[0]?.isOpen ? availableDays[0].isoString : availableDays[1]?.isoString || availableDays[0]?.isoString
  );

  // 4. Time Slot Selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timePeriodFilter, setTimePeriodFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');

  // Generate realistic time slots for the chosen date
  const generatedSlots = useMemo(() => {
    // Generate hours based on standard salon hours (08:30 to 19:30)
    const morningSlots = ['08:30', '09:15', '10:00', '10:45', '11:30'];
    const afternoonSlots = ['13:30', '14:15', '15:00', '15:45', '16:30', '17:15'];
    const eveningSlots = ['18:00', '18:45', '19:30'];

    const all = [
      ...morningSlots.map((t) => ({ time: t, period: 'manha' as const })),
      ...afternoonSlots.map((t) => ({ time: t, period: 'tarde' as const })),
      ...eveningSlots.map((t) => ({ time: t, period: 'noite' as const })),
    ];

    // Simulate busy slots deterministically based on date string and professional
    return all.map((slot) => {
      const hash = `${selectedDateIso}-${slot.time}-${selectedProfessional}`
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isOccupied = hash % 5 === 0; // ~20% of slots occupied for realism
      return {
        ...slot,
        available: !isOccupied,
      };
    });
  }, [selectedDateIso, selectedProfessional]);

  const filteredSlots = useMemo(() => {
    if (timePeriodFilter === 'todos') return generatedSlots;
    return generatedSlots.filter((s) => s.period === timePeriodFilter);
  }, [generatedSlots, timePeriodFilter]);

  if (!isOpen) return null;

  // Selected date metadata
  const selectedDayObj = availableDays.find((d) => d.isoString === selectedDateIso) || availableDays[0];

  const formattedFullDate = selectedDayObj
    ? `${selectedDayObj.dayOfWeekName}, ${selectedDayObj.dayOfMonth} de ${selectedDayObj.monthName}`
    : selectedDateIso;

  const activeProfObj = professionals.find((p) => p.name === selectedProfessional);
  const resolvedProfessionalName = activeProfObj?.name || (professionals[0]?.name ?? 'Carlos Henrique');
  const resolvedProfessionalAvatar = activeProfObj?.avatar || professionals[0]?.avatar;

  const handleConfirm = () => {
    if (!selectedTimeSlot) return;

    onConfirmAppointment({
      service: selectedService,
      professional: selectedProfessional === 'any' ? `${resolvedProfessionalName} (Designado)` : selectedProfessional,
      professionalAvatar: resolvedProfessionalAvatar,
      dateIso: selectedDateIso,
      dateFormatted: formattedFullDate,
      timeSlot: selectedTimeSlot,
      salonName,
      salonAddress,
      price: selectedService.price,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header do Modal */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#20C933]" />
              <h2 className="text-base font-bold text-white font-['Poppins']">
                Agenda do Salão
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
              {salonName} • Agendamento em até 60 dias
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar agenda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* 1. SELEÇÃO DO SERVIÇO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#20C933]" />
              <span>1. Serviço Escolhido</span>
            </label>

            {/* Dropdown / Seletor de Serviço */}
            <div className="relative">
              <select
                value={selectedService.id}
                onChange={(e) => {
                  const srv = services.find((s) => s.id === e.target.value);
                  if (srv) setSelectedService(srv);
                }}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold rounded-xl p-3 pr-8 focus:outline-none focus:border-[#20C933] cursor-pointer appearance-none"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-slate-900 text-white">
                    {srv.title} — R$ {srv.price.toFixed(0)} ({srv.duration})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Card com resumo do serviço selecionado */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded">
                  {selectedService.category}
                </span>
                <h4 className="text-xs font-bold text-white mt-1">{selectedService.title}</h4>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Duração estimada: {selectedService.duration}
                </span>
              </div>
              <span className="text-base font-black text-emerald-400">
                R$ {selectedService.price.toFixed(0)}
              </span>
            </div>
          </div>

          {/* 2. SELEÇÃO DO PROFISSIONAL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#20C933]" />
              <span>2. Escolha o Profissional</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* Opção Qualquer Profissional */}
              <button
                type="button"
                onClick={() => setSelectedProfessional('any')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  selectedProfessional === 'any'
                    ? 'bg-emerald-950/60 border-[#20C933] text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-[#20C933] flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Qualquer um</p>
                  <p className="text-[10px] text-emerald-400">Mais horários livres</p>
                </div>
              </button>

              {/* Lista dos Profissionais do Salão */}
              {professionals.map((prof, idx) => {
                const isSelected = selectedProfessional === prof.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedProfessional(prof.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-[#20C933] text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{prof.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>{prof.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. SELEÇÃO DA DATA (MÁXIMO 2 MESES / 60 DIAS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#20C933]" />
                <span>3. Escolha a Data (Até 2 meses)</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-bold">
                {formattedFullDate}
              </span>
            </div>

            {/* Carrossel Horizontal de Dias */}
            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {availableDays.map((day) => {
                const isSelected = selectedDateIso === day.isoString;
                const isDisabled = !day.isOpen;

                return (
                  <button
                    key={day.isoString}
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedDateIso(day.isoString);
                      setSelectedTimeSlot(null); // Reset time when date changes
                    }}
                    className={`flex flex-col items-center justify-center min-w-[58px] py-2.5 px-2 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#20C933] border-[#20C933] text-slate-950 font-black shadow-md shadow-emerald-500/30 scale-105'
                        : isDisabled
                        ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {day.isToday ? 'Hoje' : day.dayOfWeekName}
                    </span>
                    <span className={`text-base font-black mt-0.5 ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                      {day.dayOfMonth}
                    </span>
                    <span className={`text-[9px] font-medium ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {day.monthName}
                    </span>

                    {/* Status Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected
                          ? 'bg-slate-950'
                          : isDisabled
                          ? 'bg-rose-500/40'
                          : 'bg-[#20C933]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Agendamentos disponíveis para hoje e até os próximos 60 dias.</span>
            </div>
          </div>

          {/* 4. SELEÇÃO DO HORÁRIO DISPONÍVEL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#20C933]" />
                <span>4. Horário Disponível</span>
              </label>

              {/* Filtro de Turno */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {(['todos', 'manha', 'tarde', 'noite'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTimePeriodFilter(period)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition ${
                      timePeriodFilter === period
                        ? 'bg-[#20C933] text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Horários */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
              {filteredSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.time;
                const isAvailable = slot.available;

                return (
                  <button
                    key={slot.time}
                    disabled={!isAvailable}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#20C933] border-[#20C933] text-slate-950 shadow-md shadow-emerald-500/25 scale-102 font-black'
                        : !isAvailable
                        ? 'bg-slate-900/40 border-slate-900 text-slate-600 line-through opacity-40 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/60 hover:text-white cursor-pointer'
                    }`}
                  >
                    <Clock className={`w-3 h-3 ${isSelected ? 'text-slate-950' : isAvailable ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. RESUMO DO AGENDAMENTO */}
          {selectedTimeSlot && (
            <div className="p-3.5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#20C933]" />
                <span>Resumo da sua Reserva</span>
              </div>

              <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estabelecimento:</span>
                  <span className="font-bold text-white">{salonName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serviço:</span>
                  <span className="font-bold text-white">{selectedService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profissional:</span>
                  <span className="font-bold text-white">{selectedProfessional === 'any' ? resolvedProfessionalName : selectedProfessional}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data & Hora:</span>
                  <span className="font-bold text-emerald-300">{formattedFullDate} às {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Total a pagar no local:</span>
                  <span className="font-black text-emerald-400 text-sm">R$ {selectedService.price.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal com Botão de Confirmação */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
            <span className="text-lg font-black text-emerald-400 leading-tight">
              R$ {selectedService.price.toFixed(0)}
            </span>
          </div>

          <button
            disabled={!selectedTimeSlot}
            onClick={handleConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition font-['Poppins'] flex items-center justify-center gap-2 shadow-lg ${
              selectedTimeSlot
                ? 'bg-[#20C933] hover:bg-[#1bb32d] active:scale-98 text-slate-950 shadow-emerald-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedTimeSlot ? `Confirmar para ${selectedTimeSlot}` : 'Escolha um Horário'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
