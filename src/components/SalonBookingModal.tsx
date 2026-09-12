import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, Calendar, Clock, User, CheckCircle2, ChevronLeft, ChevronRight, 
  Sparkles, Star, Scissors, ArrowLeft, Building2
} from 'lucide-react';
import { ServiceOffer } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getAvailableSlotsForDate } from '../utils/bookingSlots';

export interface CatalogServiceItem {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  aspectRatio?: string;
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
  skipDateStep?: boolean;
  initialTimeSlot?: string | null;
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

type Step = 'date' | 'professionals_and_time' | 'confirmation';

export const SalonBookingModal: React.FC<SalonBookingModalProps> = ({
  isOpen,
  onClose,
  salonName,
  salonAddress = 'Rua das Flores, 1420 - Centro, Curitiba, PR',
  services,
  professionals,
  initialService,
  baseOffer,
  skipDateStep = false,
  initialTimeSlot,
  onConfirmAppointment,
}) => {
  const { isDark } = useTheme();

  // Step state: 'date' (Phase 1: Monthly Calendar only) -> 'professionals_and_time' (Phase 2: Professionals + Time Table below) -> 'confirmation' (Phase 3: Summary)
  const [currentStep, setCurrentStep] = useState<Step>('date');

  // 1. Selected Service State (Fixed to the published service/offer accessed)
  const [selectedService, setSelectedService] = useState<CatalogServiceItem>(() => {
    if (initialService) return initialService;
    if (baseOffer) {
      return {
        id: baseOffer.id,
        title: baseOffer.serviceTitle,
        duration: baseOffer.duration,
        price: baseOffer.price,
        description: baseOffer.description,
        category: baseOffer.serviceCategory,
      };
    }
    return services?.[0] || {
      id: 'srv-1',
      title: 'Corte Degradê / Fade Moderno',
      duration: '40 min',
      price: 55,
      description: 'Corte com acabamento preciso na lâmina',
      category: 'Cabelo',
    };
  });

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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(initialTimeSlot || null);
  const [timePeriodFilter, setTimePeriodFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');

  // Rastrear estado anterior de abertura para inicializar APENAS na transição de fechado -> aberto
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (initialTimeSlot) {
        setSelectedTimeSlot(initialTimeSlot);
        setCurrentStep('confirmation');
      } else {
        setCurrentStep(skipDateStep ? 'professionals_and_time' : 'date');
        setSelectedTimeSlot(null);
      }
      setSelectedProfessional('any');
      if (initialService) {
        setSelectedService(initialService);
      } else if (baseOffer) {
        setSelectedService({
          id: baseOffer.id,
          title: baseOffer.serviceTitle,
          duration: baseOffer.duration,
          price: baseOffer.price,
          description: baseOffer.description,
          category: baseOffer.serviceCategory,
        });
      } else if (services && services.length > 0) {
        setSelectedService(services[0]);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, skipDateStep, initialTimeSlot, initialService, baseOffer, services]);

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
    return getAvailableSlotsForDate(selectedDateIso, selectedProfessional);
  }, [selectedDateIso, selectedProfessional]);

  const filteredSlots = useMemo(() => {
    if (timePeriodFilter === 'todos') return generatedSlots;
    return generatedSlots.filter((s) => s.period === timePeriodFilter);
  }, [generatedSlots, timePeriodFilter]);

  if (!isOpen) return null;

  // Selected date formatted (DD/MM)
  const [, selMonth, selDay] = selectedDateIso.split('-');
  const shortDateFormatted = `${selDay}/${selMonth}`;

  const activeProfObj = professionals.find((p) => p.name === selectedProfessional);
  const resolvedProfessionalName = activeProfObj?.name || (professionals[0]?.name ?? 'Equipe do Salão');
  const resolvedProfessionalAvatar = activeProfObj?.avatar || professionals[0]?.avatar;

  const handleSelectDateAndAdvance = (iso: string) => {
    setSelectedDateIso(iso);
    setSelectedTimeSlot(null);
    setCurrentStep('professionals_and_time');
  };

  const handleConfirmFinal = () => {
    if (!selectedTimeSlot) return;

    onConfirmAppointment({
      service: selectedService,
      professional: selectedProfessional === 'any' ? `${resolvedProfessionalName} (Designado)` : selectedProfessional,
      professionalAvatar: resolvedProfessionalAvatar,
      dateIso: selectedDateIso,
      dateFormatted: shortDateFormatted,
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
        className={`w-full max-w-lg border rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-950 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header do Modal com Progresso das Etapas */}
        <div className={`px-4 py-3 border-b sticky top-0 z-10 transition-colors ${
          isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-100/95 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {currentStep !== 'date' ? (
                <button
                  onClick={() => {
                    if (currentStep === 'professionals_and_time') setCurrentStep('date');
                    else if (currentStep === 'confirmation') setCurrentStep('professionals_and_time');
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                  aria-label="Voltar etapa anterior"
                >
                  <ArrowLeft className="w-4 h-4 text-[#20C933]" />
                  <span className="text-xs font-bold">Voltar</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                  aria-label="Voltar e fechar"
                  title="Voltar / Fechar"
                >
                  <ArrowLeft className="w-4 h-4 text-[#20C933]" />
                  <span className="text-xs font-bold">Voltar</span>
                </button>
              )}
              <h2 className={`text-sm sm:text-base font-bold font-['Poppins'] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {currentStep === 'date' && 'Data'}
                {currentStep === 'professionals_and_time' && 'Profissional & Horário'}
                {currentStep === 'confirmation' && 'Confirmação'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator Compacto */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: 'date', label: '1. Data' },
              { key: 'professionals_and_time', label: '2. Horário' },
              { key: 'confirmation', label: '3. Confirmar' },
            ].map((st, idx) => {
              const stepOrder: Record<Step, number> = { date: 1, professionals_and_time: 2, confirmation: 3 };
              const currentOrder = stepOrder[currentStep];
              const thisOrder = idx + 1;
              const isPassed = thisOrder < currentOrder;
              const isCurrent = thisOrder === currentOrder;

              return (
                <div key={st.key} className="flex flex-col gap-0.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#20C933] shadow-sm shadow-emerald-500/50'
                        : isPassed
                        ? 'bg-emerald-600'
                        : isDark
                        ? 'bg-slate-800'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center ${
                    isCurrent
                      ? isDark ? 'text-emerald-400' : 'text-[#087A2A]'
                      : isPassed
                      ? isDark ? 'text-slate-300' : 'text-slate-600'
                      : isDark ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* Banner Compacto do Serviço Selecionado com Data/Horário Solicitados */}
          <div className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <Scissors className="w-3.5 h-3.5 text-[#20C933] flex-shrink-0" />
              <div className="min-w-0">
                <span className={`text-xs font-bold truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedService.title}
                </span>
                <span className={`text-[10px] truncate block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {salonName} • {selectedService.duration}
                </span>
              </div>
            </div>
            <span className={`text-xs sm:text-sm font-black font-mono flex-shrink-0 ml-2 flex items-center gap-1 ${
              isDark ? 'text-emerald-400' : 'text-[#087A2A]'
            }`}>
              <Clock className="w-3.5 h-3.5 text-[#20C933] shrink-0" />
              <span>{selectedTimeSlot ? `${shortDateFormatted} às ${selectedTimeSlot}` : shortDateFormatted}</span>
            </span>
          </div>

          {/* ============================================================ */}
          {/* FASE 1: SOMENTE A AGENDA / CALENDÁRIO MENSAL */}
          {/* ============================================================ */}
          {currentStep === 'date' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Header do Mês com Controles */}
              <div className={`flex items-center justify-between p-2.5 px-3 rounded-2xl border transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <button
                  onClick={handlePrevMonth}
                  className={`p-2 rounded-xl transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <h3 className={`text-sm font-black uppercase tracking-wider font-['Poppins'] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {monthData.monthLabel}
                  </h3>
                </div>

                <button
                  onClick={handleNextMonth}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid dos Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className={`text-[10px] font-bold py-1 uppercase ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
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
                          handleSelectDateAndAdvance(item.isoString);
                        }
                      }}
                      className={`h-11 rounded-xl font-bold text-xs transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#20C933] text-white font-black drop-shadow-xs shadow-lg shadow-emerald-500/30 scale-105 z-10'
                          : item.isDisabled
                          ? isDark
                            ? 'bg-slate-950/40 text-slate-700 cursor-not-allowed border border-slate-900/50'
                            : 'bg-slate-100/50 text-slate-300 cursor-not-allowed border border-slate-200/40'
                          : isDark
                          ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40'
                          : 'bg-slate-50 hover:bg-emerald-50/50 text-slate-800 border border-slate-200 hover:border-emerald-500/40'
                      }`}
                    >
                      <span>{item.dayNumber}</span>
                      {item.isToday && !isSelected && (
                        <span className={`text-[8px] font-black uppercase ${
                          isDark ? 'text-emerald-400' : 'text-[#087A2A]'
                        }`}>Hoje</span>
                      )}
                      {item.isClosed && (
                        <span className="text-[8px] text-rose-500 font-bold">Fechado</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Botão de Avanço da Fase 1 */}
              <button
                onClick={() => setCurrentStep('professionals_and_time')}
                className="w-full py-2.5 px-4 bg-[#20C933] hover:bg-[#1bb32d] text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer font-['Poppins'] shadow-md shadow-emerald-500/20 drop-shadow-xs"
              >
                <span>Avançar para Horários</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* FASE 2: OS PROFISSIONAIS E ABAIXO A TABELA DE HORÁRIOS */}
          {/* ============================================================ */}
          {currentStep === 'professionals_and_time' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Banner da Data Selecionada (Síntese Mobile: DD/MM às HH:MM) */}
              <div className={`p-1.5 px-2.5 border rounded-xl flex items-center justify-between text-xs transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#20C933]" />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {shortDateFormatted}{selectedTimeSlot ? ` às ${selectedTimeSlot}` : ''}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep('date')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer transition ${
                    isDark
                      ? 'text-emerald-400 hover:text-white bg-slate-950 border-slate-800'
                      : 'text-[#087A2A] hover:text-emerald-800 bg-white border-slate-200'
                  }`}
                >
                  Alterar
                </button>
              </div>

              {/* BLOCO 1 DA FASE 2: SELEÇÃO DE PROFISSIONAIS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-[11px] font-bold font-['Poppins'] flex items-center gap-1 uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <User className="w-3.5 h-3.5 text-[#20C933]" />
                    <span>Profissional</span>
                  </h4>
                </div>

                {/* Opções de Profissionais em Carrossel Horizontal Enxuto */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
                  {/* Card Qualquer Profissional */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProfessional('any');
                      setSelectedTimeSlot(null);
                    }}
                    className={`min-w-[110px] max-w-[120px] flex-shrink-0 p-1.5 px-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                      selectedProfessional === 'any'
                        ? isDark
                          ? 'bg-emerald-950/90 border-[#20C933] text-white shadow-sm shadow-emerald-500/20'
                          : 'bg-emerald-50 border-[#20C933] text-slate-900 shadow-sm shadow-emerald-500/10'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                      selectedProfessional === 'any'
                        ? 'bg-[#20C933] text-white font-bold drop-shadow-xs'
                        : isDark
                        ? 'bg-emerald-600/30 text-[#20C933]'
                        : 'bg-emerald-100 text-[#087A2A]'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold truncate">Qualquer</span>
                  </button>

                  {/* Cards Individuais da Equipe */}
                  {professionals.map((prof, idx) => {
                    const isSelected = selectedProfessional === prof.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedProfessional(prof.name);
                          setSelectedTimeSlot(null);
                        }}
                        className={`min-w-[110px] max-w-[125px] flex-shrink-0 p-1.5 px-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-950/90 border-[#20C933] text-white shadow-sm shadow-emerald-500/20'
                              : 'bg-emerald-50 border-[#20C933] text-slate-900 shadow-sm shadow-emerald-500/10'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={prof.avatar}
                          alt={prof.name}
                          className="w-6 h-6 rounded-md object-cover ring-1 ring-emerald-500/30 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5 className={`text-[11px] font-bold truncate leading-tight ${
                            isSelected
                              ? isDark ? 'text-white' : 'text-slate-900'
                              : isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {prof.name}
                          </h5>
                          <div className="flex items-center gap-0.5 text-[9px] text-amber-500 leading-tight">
                            <Star className="w-2.5 h-2.5 fill-amber-500" />
                            <span>{prof.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BLOCO 2 DA FASE 2: TABELA DE HORÁRIOS (ULTRA COMPACTA) */}
              <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-[11px] font-bold font-['Poppins'] flex items-center gap-1 uppercase tracking-wider truncate ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Clock className="w-3.5 h-3.5 text-[#20C933] flex-shrink-0" />
                    <span>Horários</span>
                  </h4>
                  
                  {/* Filtro de Turnos */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border flex-shrink-0 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {(['todos', 'manha', 'tarde', 'noite'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setTimePeriodFilter(period)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold capitalize transition ${
                          timePeriodFilter === period
                            ? 'bg-[#20C933] text-white font-bold drop-shadow-xs'
                            : isDark
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade da Tabela de Horários - 4 Colunas Ultra Enxutas */}
                <div className="grid grid-cols-4 gap-1.5">
                  {filteredSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    const isAvailable = slot.available;

                    return (
                      <button
                        key={slot.time}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedTimeSlot(slot.time);
                          setCurrentStep('confirmation'); // Advance to final confirmation screen on click
                        }}
                        className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#20C933] border-[#20C933] text-white font-black drop-shadow-xs shadow-sm shadow-emerald-500/30'
                            : !isAvailable
                            ? isDark
                              ? 'bg-slate-900/30 border-slate-900 text-slate-600 line-through opacity-40 cursor-not-allowed'
                              : 'bg-slate-100/50 border-slate-200 text-slate-300 line-through opacity-40 cursor-not-allowed'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700'
                        }`}
                      >
                        <Clock className={`w-3 h-3 ${isSelected ? 'text-white' : isAvailable ? 'text-[#20C933]' : isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        <span>{slot.time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* FASE 3: CONFIRMAÇÃO DO AGENDAMENTO (CARD ÚNICO E OBJETIVO) */}
          {/* ============================================================ */}
          {currentStep === 'confirmation' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Card Único e Limpo de Resumo do Atendimento */}
              <div className={`p-4 border rounded-2xl space-y-3 shadow-sm transition-colors ${
                isDark ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-50 border-emerald-500/30'
              }`}>
                <div className={`flex items-center justify-between pb-2.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-emerald-400' : 'text-[#087A2A]'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-[#20C933]" />
                    <span>Resumo do Agendamento</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isDark ? 'text-slate-300 bg-slate-800' : 'text-slate-700 bg-slate-200'
                  }`}>
                    Pagamento no Local
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Scissors className="w-3.5 h-3.5 text-[#20C933]" /> Serviço:
                    </span>
                    <span className={`font-bold text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedService.title}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Building2 className="w-3.5 h-3.5 text-[#20C933]" /> Estabelecimento:
                    </span>
                    <span className={`font-bold text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>{salonName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <User className="w-3.5 h-3.5 text-[#20C933]" /> Profissional:
                    </span>
                    <span className={`font-bold text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedProfessional === 'any' ? resolvedProfessionalName : selectedProfessional}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center pt-2.5 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total a pagar:</span>
                    <span className={`font-black text-lg ${isDark ? 'text-emerald-400' : 'text-[#087A2A]'}`}>R$ {selectedService.price.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal com Botão de Ação Final (Fases 2 e 3) */}
        {currentStep !== 'date' && (
          <div className={`p-4 border-t flex flex-col gap-2 sticky bottom-0 z-10 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {currentStep === 'professionals_and_time' && (
              <button
                disabled={!selectedTimeSlot}
                onClick={() => setCurrentStep('confirmation')}
                className={`w-full py-3 px-4 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-['Poppins'] ${
                  selectedTimeSlot
                    ? 'bg-[#20C933] hover:bg-[#1bb32d] text-white drop-shadow-xs cursor-pointer shadow-emerald-500/20'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                <span>{selectedTimeSlot ? `Avançar para Confirmação` : 'Selecione um Horário Acima'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 'confirmation' && (
              <button
                onClick={handleConfirmFinal}
                className="w-full py-3 px-4 bg-[#20C933] hover:bg-[#1bb32d] active:scale-98 text-white drop-shadow-xs font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Poppins']"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Confirmar Agendamento</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

