import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Calendar, Clock, User, CheckCircle2, ChevronLeft, ChevronRight, 
  Sparkles, Star, Scissors, ArrowLeft, Building2, MapPin
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

type Step = 'date' | 'time' | 'confirmation';

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
  // Step state: 'date' (Calendar + Pros) -> 'time' (Slots) -> 'confirmation' (Service + Summary)
  const [currentStep, setCurrentStep] = useState<Step>('date');

  // 1. Selected Service State
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

  // 2. Date Selection State (Monthly Calendar)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentViewMonth, setCurrentViewMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDateIso, setSelectedDateIso] = useState<string>(() => {
    const d = new Date();
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Skip Sunday if today is Sunday
    return d.toISOString().split('T')[0];
  });

  // 3. Professional Selection State ('any' or professional name)
  const [selectedProfessional, setSelectedProfessional] = useState<string>('any');

  // 4. Time Slot Selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timePeriodFilter, setTimePeriodFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');

  // Sync state when modal opens or initialService changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('date');
      setSelectedTimeSlot(null);
      setSelectedProfessional('any');
      if (initialService) {
        setSelectedService(initialService);
      } else if (services.length > 0) {
        setSelectedService(services[0]);
      }
    }
  }, [isOpen, initialService, services]);

  // Monthly Calendar Generation
  const monthData = useMemo(() => {
    const year = currentViewMonth.getFullYear();
    const month = currentViewMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNameFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    const monthLabel = monthNameFormatter.format(currentViewMonth);

    const daysGrid: Array<{
      dayNumber: number | null;
      isoString: string | null;
      isToday: boolean;
      isDisabled: boolean;
      isClosed: boolean;
    }> = [];

    // Empty padding slots before 1st day of month
    for (let i = 0; i < firstDayIndex; i++) {
      daysGrid.push({ dayNumber: null, isoString: null, isToday: false, isDisabled: true, isClosed: false });
    }

    // Days of the month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);

      const iso = dateObj.toISOString().split('T')[0];
      const isPast = dateObj < today;
      const isSunday = dateObj.getDay() === 0;

      const isDisabled = isPast || isSunday;
      const isToday = dateObj.getTime() === today.getTime();

      daysGrid.push({
        dayNumber: d,
        isoString: iso,
        isToday,
        isDisabled,
        isClosed: isSunday,
      });
    }

    return {
      monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      daysGrid,
      year,
      month,
    };
  }, [currentViewMonth, today]);

  // Navigate month
  const handlePrevMonth = () => {
    const prev = new Date(currentViewMonth);
    prev.setMonth(prev.getMonth() - 1);
    if (prev.getFullYear() < today.getFullYear() || (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentViewMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentViewMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentViewMonth(next);
  };

  // Generate time slots for chosen date + pro
  const generatedSlots = useMemo(() => {
    const morningSlots = ['08:30', '09:15', '10:00', '10:45', '11:30'];
    const afternoonSlots = ['13:30', '14:15', '15:00', '15:45', '16:30', '17:15'];
    const eveningSlots = ['18:00', '18:45', '19:30'];

    const all = [
      ...morningSlots.map((t) => ({ time: t, period: 'manha' as const })),
      ...afternoonSlots.map((t) => ({ time: t, period: 'tarde' as const })),
      ...eveningSlots.map((t) => ({ time: t, period: 'noite' as const })),
    ];

    return all.map((slot) => {
      const hash = `${selectedDateIso}-${slot.time}-${selectedProfessional}`
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isOccupied = hash % 5 === 0;
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

  // Selected date formatted
  const selectedDateObj = new Date(selectedDateIso + 'T00:00:00');
  const dateFormatted = selectedDateObj.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const fullDateFormatted = selectedDateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const activeProfObj = professionals.find((p) => p.name === selectedProfessional);
  const resolvedProfessionalName = activeProfObj?.name || (professionals[0]?.name ?? 'Equipe do Salão');
  const resolvedProfessionalAvatar = activeProfObj?.avatar || professionals[0]?.avatar;

  const handleSelectProfessionalAndAdvance = (profName: string) => {
    setSelectedProfessional(profName);
    setSelectedTimeSlot(null);
    setCurrentStep('time');
  };

  const handleConfirmFinal = () => {
    if (!selectedTimeSlot) return;

    onConfirmAppointment({
      service: selectedService,
      professional: selectedProfessional === 'any' ? `${resolvedProfessionalName} (Designado)` : selectedProfessional,
      professionalAvatar: resolvedProfessionalAvatar,
      dateIso: selectedDateIso,
      dateFormatted: dateFormatted,
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
        {/* Header do Modal com Progresso das Etapas */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {currentStep !== 'date' ? (
                <button
                  onClick={() => {
                    if (currentStep === 'time') setCurrentStep('date');
                    else if (currentStep === 'confirmation') setCurrentStep('time');
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  aria-label="Voltar etapa"
                >
                  <ArrowLeft className="w-4 h-4 text-[#20C933]" />
                </button>
              ) : (
                <Calendar className="w-4 h-4 text-[#20C933]" />
              )}
              <h2 className="text-base font-bold text-white font-['Poppins']">
                {currentStep === 'date' && '1. Escolha a Data e o Profissional'}
                {currentStep === 'time' && '2. Escolha o Horário'}
                {currentStep === 'confirmation' && '3. Confirmação do Atendimento'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: 'date', label: '1. Dia & Profissional' },
              { key: 'time', label: '2. Horário' },
              { key: 'confirmation', label: '3. Confirmação' },
            ].map((st, idx) => {
              const stepOrder: Record<Step, number> = { date: 1, time: 2, confirmation: 3 };
              const currentOrder = stepOrder[currentStep];
              const thisOrder = idx + 1;
              const isPassed = thisOrder < currentOrder;
              const isCurrent = thisOrder === currentOrder;

              return (
                <div key={st.key} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#20C933] shadow-sm shadow-emerald-500/50'
                        : isPassed
                        ? 'bg-emerald-600'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                    isCurrent ? 'text-emerald-400' : isPassed ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">

          {/* ============================================================ */}
          {/* ETAPA 1: CALENDÁRIO MENSAL + CARDS DOS PROFISSIONAIS LOGO ABAIXO */}
          {/* ============================================================ */}
          {currentStep === 'date' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header do Mês com Controles */}
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Poppins']">
                    {monthData.monthLabel}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Selecione o dia do mês
                  </span>
                </div>

                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid dos Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-[10px] font-bold text-slate-500 py-1 uppercase">
                    {day}
                  </div>
                ))}

                {/* Dias do Mês em Grade */}
                {monthData.daysGrid.map((item, index) => {
                  if (item.dayNumber === null) {
                    return <div key={`empty-${index}`} className="h-10" />;
                  }

                  const isSelected = selectedDateIso === item.isoString;

                  return (
                    <button
                      key={item.isoString || index}
                      disabled={item.isDisabled}
                      onClick={() => {
                        if (item.isoString) {
                          setSelectedDateIso(item.isoString);
                        }
                      }}
                      className={`h-11 rounded-xl font-bold text-xs transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#20C933] text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-105 z-10'
                          : item.isDisabled
                          ? 'bg-slate-950/40 text-slate-700 cursor-not-allowed border border-slate-900/50'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40'
                      }`}
                    >
                      <span>{item.dayNumber}</span>
                      {item.isToday && !isSelected && (
                        <span className="text-[8px] font-black uppercase text-emerald-400">Hoje</span>
                      )}
                      {item.isClosed && (
                        <span className="text-[8px] text-rose-500 font-bold">Fechado</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* SEÇÃO DOS PROFISSIONAIS PARA O DIA SELECIONADO */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-['Poppins'] flex items-center gap-1.5 uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#20C933]" />
                    <span>Profissionais para {fullDateFormatted}:</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">Clique para ver horários</span>
                </div>

                {/* Card 1: Qualquer Profissional */}
                <button
                  type="button"
                  onClick={() => handleSelectProfessionalAndAdvance('any')}
                  className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer bg-slate-900 border-slate-800 hover:border-[#20C933] hover:bg-slate-850 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-[#20C933] group-hover:bg-[#20C933] group-hover:text-slate-950 transition">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-300 transition">
                        <span>Qualquer Profissional</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Mais Horários
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Encontra o primeiro horário livre disponível na equipe.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#20C933] transition" />
                </button>

                {/* Lista de Profissionais da Equipe */}
                {professionals.map((prof, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectProfessionalAndAdvance(prof.name)}
                    className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer bg-slate-900 border-slate-800 hover:border-[#20C933] hover:bg-slate-850 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">{prof.name}</h4>
                        <p className="text-xs text-slate-400">{prof.role}</p>
                        <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="font-bold">{prof.rating.toFixed(1)}</span>
                          <span className="text-slate-500 text-[11px]">• Horários disponíveis</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#20C933] transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 2: HORÁRIOS DISPONÍVEIS */}
          {/* ============================================================ */}
          {currentStep === 'time' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Banner do Dia e Profissional */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <User className="w-3.5 h-3.5 text-[#20C933]" />
                    <span>Profissional:</span>
                    <strong className="text-white">
                      {selectedProfessional === 'any' ? 'Qualquer Profissional Disponível' : selectedProfessional}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold capitalize">
                    <Calendar className="w-3.5 h-3.5 text-[#20C933]" />
                    <span>{fullDateFormatted}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep('date')}
                  className="text-xs font-bold text-emerald-400 hover:underline px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                >
                  Alterar
                </button>
              </div>

              {/* Filtro de Turnos */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Horários Livres
                </label>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['todos', 'manha', 'tarde', 'noite'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setTimePeriodFilter(period)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
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

              {/* Grade de Horários */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  const isAvailable = slot.available;

                  return (
                    <button
                      key={slot.time}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedTimeSlot(slot.time);
                        setCurrentStep('confirmation'); // Advance to final confirmation screen
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#20C933] border-[#20C933] text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-102'
                          : !isAvailable
                          ? 'bg-slate-900/30 border-slate-900 text-slate-600 line-through opacity-40 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : isAvailable ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 3: CONFIRMAÇÃO & DETALHES DO SERVIÇO */}
          {/* ============================================================ */}
          {currentStep === 'confirmation' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Card de Detalhes do Serviço (Aparece na tela de confirmação) */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#20C933]" />
                    <span>Serviço do Atendimento</span>
                  </span>

                  {/* Selector de troca de serviço */}
                  <select
                    value={selectedService.id}
                    onChange={(e) => {
                      const srv = services.find((s) => s.id === e.target.value);
                      if (srv) setSelectedService(srv);
                    }}
                    className="bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-bold rounded-lg p-1.5 focus:outline-none focus:border-[#20C933] cursor-pointer"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id} className="bg-slate-900 text-white">
                        {srv.title} (R$ {srv.price.toFixed(0)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded">
                      {selectedService.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{selectedService.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedService.description}</p>
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      Duração estimada: {selectedService.duration}
                    </span>
                  </div>

                  <span className="text-xl font-black text-emerald-400 flex-shrink-0">
                    R$ {selectedService.price.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Resumo Completo da Reserva */}
              <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20C933]" />
                  <span>Resumo do Agendamento</span>
                </h4>

                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> Estabelecimento:
                    </span>
                    <span className="font-bold text-white">{salonName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Profissional:
                    </span>
                    <span className="font-bold text-white">
                      {selectedProfessional === 'any' ? resolvedProfessionalName : selectedProfessional}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Data e Horário:
                    </span>
                    <span className="font-bold text-emerald-300 capitalize">
                      {dateFormatted} às {selectedTimeSlot}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-300 font-bold">Total a pagar no local:</span>
                    <span className="font-black text-emerald-400 text-base">R$ {selectedService.price.toFixed(0)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer do Modal com Botão de Ação Final */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          {currentStep === 'time' && (
            <button
              disabled={!selectedTimeSlot}
              onClick={() => setCurrentStep('confirmation')}
              className={`w-full py-3 px-4 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-['Poppins'] ${
                selectedTimeSlot
                  ? 'bg-[#20C933] hover:bg-[#1bb32d] text-slate-950 cursor-pointer shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>{selectedTimeSlot ? `Avançar para Confirmação` : 'Selecione um Horário Acima'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'confirmation' && (
            <button
              onClick={handleConfirmFinal}
              className="w-full py-3 px-4 bg-[#20C933] hover:bg-[#1bb32d] active:scale-98 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Poppins']"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Confirmar Agendamento</span>
            </button>
          )}

          {currentStep === 'date' && (
            <div className="text-[11px] text-slate-400 text-center w-full">
              Selecione o dia e clique em um profissional para ver os horários.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

