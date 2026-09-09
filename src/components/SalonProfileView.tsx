import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, MapPin, Clock, ShieldCheck, 
  Heart, Zap, CheckCircle2, Scissors, 
  Calendar, Coffee, Wifi, Car, Wind,
  Bell, Menu, Users, UserCheck, Store, ChevronRight,
  ChevronLeft, ArrowRight, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceOffer } from '../types';
import { SalonBookingModal, CatalogServiceItem } from './SalonBookingModal';
import { formatSlotDateTime } from '../utils/dateFormatter';
import { useTheme } from '../context/ThemeContext';

interface SalonProfileViewProps {
  salonName: string;
  offers: ServiceOffer[];
  onBack: () => void;
  onSelectOffer: (offer: ServiceOffer) => void;
  onDirectBook: (offer: ServiceOffer) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (salonName: string) => void;
  userName?: string;
  userAvatarUrl?: string;
  onOpenProfileDrawer?: () => void;
}

export const SalonProfileView: React.FC<SalonProfileViewProps> = ({
  salonName,
  offers,
  onBack,
  onSelectOffer,
  onDirectBook,
  isFavorite = false,
  onToggleFavorite,
  userName = 'Lucas Silva',
  userAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  onOpenProfileDrawer,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'vagas' | 'servicos' | 'sobre' | 'espaco'>('vagas');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingService, setBookingService] = useState<CatalogServiceItem | null>(null);
  const [skipDateStep, setSkipDateStep] = useState<boolean>(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Filtrar ofertas desse salão
  const salonOffers = offers.filter((o) => o.salonName === salonName);
  const primaryOffer = salonOffers[0] || offers[0];

  // Informações consolidadas do salão
  const salonInfo = {
    name: salonName,
    avatar: primaryOffer?.professionalAvatar || primaryOffer?.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    coverImage: primaryOffer?.galleryImages?.[0] || primaryOffer?.imageUrl || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    rating: primaryOffer?.rating || 4.9,
    reviewsCount: primaryOffer?.reviewsCount || 84,
    distance: primaryOffer?.distance || '850m',
    address: primaryOffer?.salonAddress || 'Rua das Flores, 1420 - Centro',
    city: 'Curitiba, PR',
    phone: '(41) 99882-1140',
    hours: 'Seg a Sáb: 09:00 às 20:00',
    verified: true,
    description: primaryOffer?.description || 'Espaço premium especializado em estética masculina e feminina de alta precisão, barboterapia, cortes modernos e bem-estar.',
    isHomeCare: false,
    amenities: [
      { icon: Wifi, label: 'Wi-Fi 5G' },
      { icon: Wind, label: 'Ar Climatizado' },
      { icon: Coffee, label: 'Café Expresso / Bar' },
      { icon: Car, label: 'Estacionamento' },
    ],
    professionals: [
      {
        name: primaryOffer?.professionalName || 'Carlos Henrique',
        role: 'Master Barber & Hair Stylist',
        avatar: primaryOffer?.professionalAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        rating: 4.9,
      },
      {
        name: 'Mateus Ramos',
        role: 'Barber & Visagista',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rating: 4.8,
      },
      {
        name: 'Juliana Costa',
        role: 'Especialista em Mechas e Cor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        rating: 5.0,
      }
    ],
  };

  // Dinâmica: Equipe vs Perfil / Espaço vs Atendimento
  const hasMultipleProfessionals = salonInfo.professionals.length > 1;
  const teamTabLabel = hasMultipleProfessionals ? 'Equipe' : 'Perfil';
  const TeamIcon = hasMultipleProfessionals ? Users : UserCheck;

  const spaceTabLabel = salonInfo.isHomeCare ? 'Atendimento' : 'Espaço';
  const SpaceIcon = salonInfo.isHomeCare ? Car : Store;

  // Catálogo completo de serviços
  const catalogServices: CatalogServiceItem[] = [
    {
      id: 'srv-1',
      title: 'Corte Degradê / Fade Moderno',
      duration: '40 min',
      price: 55,
      description: 'Corte com acabamento preciso na lâmina, lavagem especial e finalização com pomada matte.',
      category: 'Cabelo',
    },
    {
      id: 'srv-2',
      title: 'Barba Terapia Premium',
      duration: '35 min',
      price: 45,
      description: 'Design de barba com toalha quente aromática, óleos essenciais e balm pós-barba.',
      category: 'Barba',
    },
    {
      id: 'srv-3',
      title: 'Combo Corte + Barba Completo',
      duration: '60 min',
      price: 90,
      description: 'Experiência completa de corte de cabelo e tratamento completo de barba.',
      category: 'Combos',
    },
    {
      id: 'srv-4',
      title: 'Hidratação & Selagem de Fios',
      duration: '45 min',
      price: 75,
      description: 'Tratamento intensivo de nutrição capilar e alinhamento dos fios.',
      category: 'Tratamentos',
    },
    {
      id: 'srv-5',
      title: 'Sobrancelha Masculina / Feminina',
      duration: '15 min',
      price: 25,
      description: 'Limpeza e alinhamento na pinça ou navalha mantendo o aspecto natural.',
      category: 'Rosto',
    }
  ];

  // Slides de portfólio
  const portfolioSlides = [
    {
      id: 'slide-1',
      tag: 'Cabelo & Estilo',
      title: 'Corte Fade / Degradê Moderno',
      tagline: 'Aproveite para dar um up no seu visual hoje mesmo',
      image: primaryOffer?.imageUrl || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      service: catalogServices[0],
    },
    {
      id: 'slide-2',
      tag: 'Barboterapia',
      title: 'Design de Barba com Toalha Quente',
      tagline: 'Alinhamento preciso e relaxamento com óleos essenciais',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      service: catalogServices[1],
    },
    {
      id: 'slide-3',
      tag: 'Experiência VIP',
      title: 'Combo Corte + Barba Completo',
      tagline: 'O cuidado completo que você merece para o fim de semana',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      service: catalogServices[2],
    },
  ];

  // Autoplay suave
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [portfolioSlides.length]);

  const handleOpenBooking = (srv?: CatalogServiceItem, directToTimeGrid = false) => {
    setBookingService(srv || catalogServices[0]);
    setSkipDateStep(directToTimeGrid);
    setIsBookingModalOpen(true);
  };

  const handleConfirmSchedule = (bookingData: {
    service: CatalogServiceItem;
    professional: string;
    professionalAvatar?: string;
    dateIso: string;
    dateFormatted: string;
    timeSlot: string;
    salonName: string;
    salonAddress: string;
    price: number;
  }) => {
    if (primaryOffer) {
      onDirectBook({
        ...primaryOffer,
        id: `sched-${Date.now()}`,
        salonName: bookingData.salonName,
        serviceTitle: bookingData.service.title,
        price: bookingData.price,
        timeSlot: `${bookingData.dateFormatted} às ${bookingData.timeSlot}`,
        dayLabel: bookingData.dateFormatted,
        serviceCategory: (bookingData.service.category.toLowerCase().includes('barba') ? 'barba' : 'cabelo') as any,
      });
    }
  };

  return (
    <div className={`w-full ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-full pb-12 font-['Poppins'] transition-colors duration-200`}>
      {/* 1. CABEÇALHO DO APLICATIVO DO SALÃO (Header Nativo) */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-[#151A1E]/95 border-slate-800/80' : 'bg-white/95 border-slate-200/90 shadow-xs'} backdrop-blur-md border-b px-3.5 py-2.5 shadow-md flex items-center justify-between gap-2.5 transition-colors`}>
        {/* Lado Esquerdo: Botão Radar + Logo e Boas-Vindas */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Botão sutil para voltar ao Radar/Portal */}
          <button
            onClick={onBack}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition active:scale-95 text-xs font-semibold cursor-pointer shrink-0 ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
            }`}
            title="Voltar ao Radar do Vagou"
            aria-label="Voltar para o Radar"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-bold">Radar</span>
          </button>

          <span className={`w-px h-5 shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Logo da Empresa e Saudação */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={`relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-emerald-500/40 shrink-0 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <img
                src={salonInfo.avatar}
                alt={salonInfo.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] leading-none block truncate font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Olá, {userName.split(' ')[0]} 👋
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <h1 className={`text-xs font-bold leading-none truncate max-w-[120px] sm:max-w-[170px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {salonInfo.name}
                </h1>
                {salonInfo.verified && (
                  <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" title="Verificado" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Tema + Favoritar + Notificação + Foto do Usuário + Configurações */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão Mágico de Alternar Tema (Claro / Escuro) */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
            }`}
            title={isDark ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
            aria-label="Alternar Tema"
          >
            {isDark ? <Sun className="w-4 h-4 transition-transform hover:rotate-45" /> : <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />}
          </button>

          {/* Botão de Favoritar Rápido */}
          <button
            onClick={() => onToggleFavorite?.(salonInfo.name)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-xs'
            }`}
            title="Favoritar este estabelecimento"
            aria-label="Favoritar estabelecimento"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </button>

          {/* Ícone de Notificação com Badge */}
          <button
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
            }`}
            title="Notificações do Salão"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ${isDark ? 'ring-slate-950' : 'ring-white'}`} />
          </button>

          {/* Foto de Perfil do Usuário */}
          <button
            onClick={onOpenProfileDrawer}
            className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-emerald-500/50 hover:ring-emerald-500 transition active:scale-95 cursor-pointer shrink-0"
            title="Meu Perfil"
            aria-label="Meu Perfil"
          >
            <img
              src={userAvatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Ícone de Configurações (Três tracinhos horizontais) */}
          <button
            onClick={onOpenProfileDrawer}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
            }`}
            title="Configurações e Menu"
            aria-label="Menu de Configurações"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-3.5 pt-3 space-y-3">
        {/* 2. CARROSSEL DE SERVIÇOS / PORTFÓLIO (Não muito alto, ~135px) */}
        <div className={`relative w-full h-[135px] rounded-xl overflow-hidden border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <AnimatePresence mode="wait">
            {portfolioSlides.map((slide, idx) => {
              if (idx !== activeSlideIndex) return null;
              return (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Imagem de Fundo do Serviço */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Degradê Linear Lateral Escuro Suave para Contraste Impecável */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />

                  {/* Conteúdo à Esquerda: Categoria + Título Resumido + Chamada Publicitária + Botão Agendar */}
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-between z-10 max-w-[75%] sm:max-w-[70%]">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                        {slide.tag}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
                        {slide.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-normal leading-tight line-clamp-1 mt-0.5">
                        {slide.tagline}
                      </p>
                    </div>

                    {/* Botão Sutil "Agendar" com Glassmorphism Refinado */}
                    <div>
                      <button
                        onClick={() => handleOpenBooking(slide.service)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        <span>Agendar</span>
                        <ArrowRight className="w-3 h-3 text-emerald-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Controles do Slide: Indicadores de Bolinhas no Canto Inferior Direito */}
          <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-2 py-1 rounded-full border border-slate-800/80">
            {portfolioSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveSlideIndex(dotIdx)}
                className={`transition-all rounded-full cursor-pointer ${
                  dotIdx === activeSlideIndex
                    ? 'w-3.5 h-1.5 bg-emerald-400'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          {/* Setas Sutis de Navegação */}
          <button
            onClick={() => setActiveSlideIndex((prev) => (prev - 1 + portfolioSlides.length) % portfolioSlides.length)}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. BOTÃO COM BORDAS EM 5px: "HORÁRIOS HOJE" (Gradiente Linear & Texto Branco Puro) */}
        <div>
          <button
            onClick={() => handleOpenBooking(undefined, true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 via-[#20C933] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-[5px] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_2px_10px_-2px_rgba(32,201,51,0.35)] border border-emerald-400/30 cursor-pointer active:scale-[0.99]"
          >
            <Calendar className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">HORÁRIOS HOJE</span>
          </button>
        </div>

        {/* 4. GRID DE OPÇÕES (Agenda, Serviços, Equipe/Perfil, Espaço/Atendimento) */}
        <nav className="grid grid-cols-4 gap-2 pt-0.5">
          {[
            { id: 'vagas', label: 'Agenda', icon: Calendar },
            { id: 'servicos', label: 'Serviços', icon: Scissors },
            { id: 'sobre', label: teamTabLabel, icon: TeamIcon },
            { id: 'espaco', label: spaceTabLabel, icon: SpaceIcon },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer font-['Poppins'] ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-emerald-950/50 border border-emerald-500/60 text-white shadow-[0_0_12px_-3px_rgba(32,201,51,0.3)] font-bold ring-1 ring-emerald-500/40'
                      : 'bg-gradient-to-b from-emerald-50/90 to-white border border-[#20C933] text-emerald-950 shadow-[0_2px_10px_rgba(32,201,51,0.15)] font-bold ring-1 ring-[#20C933]/30'
                    : isDark
                      ? 'bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <TabIconComponent className={`w-5 h-5 mb-1 transition-colors ${
                  isActive 
                    ? isDark ? 'text-emerald-400' : 'text-[#087A2A]' 
                    : isDark ? 'text-slate-400' : 'text-slate-400'
                }`} />
                <span className="text-[11px] sm:text-xs font-bold leading-tight select-none truncate w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. CONTEÚDO DAS ABAS (Com Transição Suave via Motion) */}
      <div className="px-3.5 mt-3.5">
        <AnimatePresence mode="wait">
          {/* ABA: AGENDA / VAGAS IMEDIATAS NO RADAR */}
          {activeTab === 'vagas' && (
            <motion.div
              key="aba-vagas"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>Vagas Imediatas no Radar</span>
                </h2>
                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                    : 'text-[#087A2A] bg-emerald-50 border-emerald-400/40'
                }`}>
                  Reserva Instantânea
                </span>
              </div>

              {salonOffers.length > 0 ? (
                salonOffers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => onSelectOffer(offer)}
                    className={`border rounded-xl p-3.5 transition-all duration-200 shadow-sm relative overflow-hidden group cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/60'
                        : 'bg-white border-slate-200/90 hover:border-[#20C933]/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                            isDark
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                              : 'bg-emerald-50 border-emerald-400/40 text-[#087A2A]'
                          }`}>
                            {formatSlotDateTime(offer.timeSlot)}
                          </span>
                          {offer.expiresInMinutes && (
                            <span className="text-[11px] text-rose-500 font-bold">
                              Expira em {offer.expiresInMinutes} min
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-bold mt-1.5 transition-colors ${
                          isDark
                            ? 'text-white group-hover:text-emerald-300'
                            : 'text-slate-900 group-hover:text-[#087A2A]'
                        }`}>
                          {offer.serviceTitle}
                        </h4>

                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Com <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{offer.professionalName}</strong> • {offer.duration}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0 flex flex-col items-end">
                        {offer.originalPrice && offer.originalPrice > offer.price && (
                          <span className="text-[10px] text-slate-400 line-through block mt-0.5">
                            R${offer.originalPrice.toFixed(0)}
                          </span>
                        )}
                        <span className={`text-base font-black ${isDark ? 'text-emerald-400' : 'text-[#087A2A]'}`}>
                          R${offer.price.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                      <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Sem fila de espera
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDirectBook(offer);
                        }}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white text-xs font-bold rounded-lg transition shadow-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Agendar Agora</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-6 text-center rounded-xl border shadow-sm ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <Clock className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sem vagas imediatas no momento</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Consulte a agenda para escolher dia e horário.</p>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="mt-3 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span>Ver Agenda Completa</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ABA: TODOS OS SERVIÇOS */}
          {activeTab === 'servicos' && (
            <motion.div
              key="aba-servicos"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Scissors className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cardápio de Atendimentos</span>
                </h2>
                <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {catalogServices.length} serviços disponíveis
                </span>
              </div>

              {catalogServices.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => handleOpenBooking(srv)}
                  className={`border rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-sm transition cursor-pointer group ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                      : 'bg-white border-slate-200/90 shadow-xs hover:border-[#20C933]/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {srv.category}
                      </span>
                      <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock className="w-3 h-3 text-slate-400" />
                        {srv.duration}
                      </span>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold mt-1 transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-emerald-300'
                        : 'text-slate-900 group-hover:text-[#087A2A]'
                    }`}>
                      {srv.title}
                    </h4>
                    <p className={`text-[11px] mt-0.5 leading-relaxed line-clamp-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {srv.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span className={`text-sm font-extrabold ${isDark ? 'text-emerald-400' : 'text-[#087A2A]'}`}>
                      R${srv.price.toFixed(0)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBooking(srv);
                      }}
                      className={`mt-2 px-3 py-1.5 border text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                        isDark
                          ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border-slate-700 hover:border-emerald-500'
                          : 'bg-slate-100 hover:bg-[#20C933] text-slate-800 hover:text-white border-slate-200 hover:border-[#20C933] shadow-xs'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Agendar</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ABA: EQUIPE OU PERFIL DO PROFISSIONAL */}
          {activeTab === 'sobre' && (
            <motion.div
              key="aba-sobre"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-3"
            >
              {/* Apresentação */}
              <div className={`border rounded-xl p-3.5 shadow-sm ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {hasMultipleProfessionals ? 'Equipe & Especialistas' : 'Perfil do Profissional'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Profissionais qualificados dedicados à estética de alto padrão, visagismo e atendimento personalizado.
                </p>
              </div>

              {/* Cards da Equipe */}
              <div className="grid grid-cols-2 gap-2.5">
                {salonInfo.professionals.map((prof, idx) => (
                  <div key={idx} className={`flex flex-col items-center p-3 rounded-xl border text-center shadow-xs ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-emerald-500/40 mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className={`text-xs font-bold truncate w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>{prof.name}</h4>
                    <p className={`text-[10px] line-clamp-1 mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{prof.role}</p>

                    <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-bold text-slate-950 bg-amber-400 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      {prof.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ABA: ESPAÇO OU ATENDIMENTO */}
          {activeTab === 'espaco' && (
            <motion.div
              key="aba-espaco"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-3"
            >
              {/* Localização e Horário */}
              <div className={`flex flex-col gap-1.5 border rounded-xl p-3.5 text-xs shadow-sm ${
                isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{salonInfo.address}, {salonInfo.city}</span>
                </div>
                <div className={`flex items-center gap-2 pt-1.5 border-t mt-0.5 ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{salonInfo.hours}</span>
                </div>
              </div>

              {/* Estrutura / Comodidades */}
              <div className={`border rounded-xl p-3.5 space-y-2.5 shadow-sm ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Store className="w-4 h-4 text-emerald-500" />
                  <span>{salonInfo.isHomeCare ? 'Modalidade de Atendimento' : 'Estrutura do Espaço'}</span>
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {salonInfo.description}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {salonInfo.amenities.map((amenity, idx) => (
                    <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <amenity.icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapa com Botão Como Chegar */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonInfo.name + ' ' + salonInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-[#20C933] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 uppercase tracking-wider"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>COMO CHEGAR (GOOGLE MAPS)</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Agendamento da Agenda do Salão (Até 60 dias) */}
      <SalonBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        salonName={salonInfo.name}
        salonAddress={salonInfo.address}
        services={catalogServices}
        professionals={salonInfo.professionals}
        initialService={bookingService}
        baseOffer={primaryOffer}
        skipDateStep={skipDateStep}
        onConfirmAppointment={handleConfirmSchedule}
      />
    </div>
  );
};
