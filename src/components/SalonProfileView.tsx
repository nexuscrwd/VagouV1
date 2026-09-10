import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, MapPin, Clock, 
  Heart, Zap, CheckCircle2, Scissors, 
  Calendar, Coffee, Wifi, Car, Wind,
  Bell, Users, UserCheck, Store,
  Activity, ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceOffer } from '../types';
import { SalonBookingModal, CatalogServiceItem } from './SalonBookingModal';
import { formatSlotDateTime } from '../utils/dateFormatter';
import { useTheme } from '../context/ThemeContext';
import { getSalonLogo } from '../utils/salonLogos';
import { SalonNavContext } from './BottomNav';

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
  onRegisterBottomNav?: (ctx: SalonNavContext | null) => void;
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
  onRegisterBottomNav,
}) => {
  const { isDark } = useTheme();
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
    avatar: getSalonLogo(salonName, primaryOffer?.salonLogo),
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

  // Registrar context do menu de navegação do rodapé
  useEffect(() => {
    if (onRegisterBottomNav) {
      onRegisterBottomNav({
        activeTab,
        onSelectTab: (tab) => setActiveTab(tab),
        teamTabLabel,
        spaceTabLabel,
        TeamIcon,
        SpaceIcon,
      });
    }
    return () => {
      if (onRegisterBottomNav) {
        onRegisterBottomNav(null);
      }
    };
  }, [activeTab, teamTabLabel, spaceTabLabel, TeamIcon, SpaceIcon, onRegisterBottomNav]);

  // Cadeiras em Atendimento Ao Vivo no Salão
  const activeChairsData = [
    {
      id: 'chair-1',
      number: 'Cadeira 01',
      professional: 'Carlos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      serviceTitle: 'Corte Degradê',
      remainingMinutes: 14,
      totalMinutes: 40,
      endTime: '14:15',
      isCurrentUser: true,
    },
    {
      id: 'chair-2',
      number: 'Cadeira 02',
      professional: 'Mateus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      serviceTitle: 'Barba Terapia',
      remainingMinutes: 8,
      totalMinutes: 35,
      endTime: '14:10',
      isCurrentUser: false,
    },
    {
      id: 'chair-3',
      number: 'Cadeira 03',
      professional: 'Juliana',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      serviceTitle: 'Escova & Mechas',
      remainingMinutes: 28,
      totalMinutes: 60,
      endTime: '14:30',
      isCurrentUser: false,
    },
  ];

  // Próximos 4 horários futuros em aberto no dia
  const upcomingOpenSlots = [
    {
      id: 'slot-1',
      timeSlot: '14:00',
      serviceTitle: 'Corte Degradê / Fade Moderno',
      professionalName: 'Carlos',
      price: 55,
      duration: '40 min',
      category: 'Cabelo',
    },
    {
      id: 'slot-2',
      timeSlot: '14:45',
      serviceTitle: 'Barba Terapia Premium',
      professionalName: 'Mateus',
      price: 45,
      duration: '35 min',
      category: 'Barba',
    },
    {
      id: 'slot-3',
      timeSlot: '15:30',
      serviceTitle: 'Combo Corte + Barba Completo',
      professionalName: 'Carlos',
      price: 90,
      duration: '60 min',
      category: 'Combos',
    },
    {
      id: 'slot-4',
      timeSlot: '16:15',
      serviceTitle: 'Hidratação & Selagem de Fios',
      professionalName: 'Juliana',
      price: 75,
      duration: '45 min',
      category: 'Tratamentos',
    },
  ];

  // Catálogo completo de serviços com imagens coesas e proporções variadas no estilo Pinterest Masonry
  const catalogServices: CatalogServiceItem[] = [
    {
      id: 'srv-1',
      title: 'Corte Degradê / Fade Moderno',
      duration: '40 min',
      price: 55,
      description: 'Corte com acabamento preciso na lâmina, lavagem especial e finalização com pomada matte.',
      category: 'Cabelo',
      image: primaryOffer?.imageUrl || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[3/4]', // Vertical Alto
    },
    {
      id: 'srv-2',
      title: 'Barba Terapia Premium',
      duration: '35 min',
      price: 45,
      description: 'Design de barba com toalha quente aromática, óleos essenciais e balm pós-barba.',
      category: 'Barba',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-square', // Quadrado
    },
    {
      id: 'srv-3',
      title: 'Combo Corte + Barba VIP',
      duration: '60 min',
      price: 90,
      description: 'Experiência completa de corte de cabelo e tratamento completo de barba.',
      category: 'Combos',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[4/3]', // Horizontal Panorâmico
    },
    {
      id: 'srv-4',
      title: 'Corte na Tesoura & Textura',
      duration: '45 min',
      price: 65,
      description: 'Técnica de corte à mão livre na tesoura com alinhamento e finalização personalizada.',
      category: 'Cabelo',
      image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[4/5]', // Vertical Elegante
    },
    {
      id: 'srv-5',
      title: 'Acabamento na Navalha & Visagismo',
      duration: '20 min',
      price: 30,
      description: 'Desenho de linhas com navalha descartável, visagismo facial e pós-barba calmante.',
      category: 'Rosto',
      image: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-square', // Quadrado
    },
    {
      id: 'srv-6',
      title: 'Mechas & Iluminação de Fios',
      duration: '90 min',
      price: 130,
      description: 'Técnica personalizada de iluminação dos fios e tonalização exclusiva.',
      category: 'Cabelo',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[3/4]', // Vertical Alto
    },
    {
      id: 'srv-7',
      title: 'Lavagem & Hidratação Especial',
      duration: '35 min',
      price: 50,
      description: 'Higienização com massagem no couro cabeludo e máscara reconstrutora intensiva.',
      category: 'Tratamentos',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[4/3]', // Horizontal Panorâmico
    },
    {
      id: 'srv-8',
      title: 'Cuidado Facial & Toalha Quente',
      duration: '40 min',
      price: 60,
      description: 'Higienização facial com esfoliação suave e vapor de toalha aquecida com ervas.',
      category: 'Estética',
      image: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'aspect-[4/5]', // Vertical Elegante
    },
  ];

  // Slides de portfólio para o Slider da Página Inicial
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

  // Autoplay suave para o slider da página inicial
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
      {/* 1. CABEÇALHO DO APLICATIVO DO SALÃO (Logo Full Height & Botões Selecionados) */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-[#151A1E]/95 border-slate-800/80' : 'bg-white/95 border-slate-200/90 shadow-xs'} backdrop-blur-md border-b pr-4 shadow-md flex items-center justify-between gap-3 transition-colors h-14 sm:h-16 overflow-hidden`}>
        {/* Lado Esquerdo: Logotipia em Texto da Empresa (Moderna, estilosa e limpa, 103px de largura) */}
        <div 
          className="h-full w-[103px] pl-3.5 pr-1 flex items-center shrink-0 select-none cursor-pointer"
          title={salonInfo.name}
        >
          <span className={`font-sans text-xs sm:text-[13px] font-extrabold tracking-tight uppercase leading-tight line-clamp-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="text-emerald-500">{salonInfo.name.split(' ')[0]}</span>{' '}
            {salonInfo.name.split(' ').slice(1).join(' ')}
          </span>
        </div>

        {/* Lado Direito: Favoritar + Notificação + Foto do Usuário */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favoritar Rápido */}
          <button
            onClick={() => onToggleFavorite?.(salonInfo.name)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-xs'
            }`}
            title="Favoritar este estabelecimento"
            aria-label="Favoritar estabelecimento"
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </button>

          {/* Notificações */}
          <button
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
            }`}
            title="Notificações do Salão"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ${isDark ? 'ring-slate-950' : 'ring-white'}`} />
          </button>

          {/* Foto do Usuário (No cabeçalho principal após as notificações) */}
          <button
            onClick={onOpenProfileDrawer}
            className="relative group flex items-center justify-center shrink-0 w-10 h-10 rounded-xl overflow-hidden ring-1.5 ring-emerald-500 hover:ring-emerald-400 transition shadow-xs cursor-pointer bg-slate-800"
            title="Ver Perfil do Usuário e Opções"
            aria-label="Perfil do Usuário e Opções"
          >
            <img
              src={userAvatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </header>

      {/* 2. SUBCABEÇALHO DE BOAS-VINDAS */}
      <div className={`px-3.5 border-b flex items-center justify-between gap-3 transition-colors h-12 ${
        isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0 py-1">
          {/* Botão Sair do Estabelecimento (movido para a esquerda das boas-vindas) */}
          <button
            onClick={onBack}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 ${
              isDark
                ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
            }`}
            title="Sair do Estabelecimento"
            aria-label="Sair"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-500" />
          </button>

          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />

          <div className="min-w-0">
            <h2 className={`text-xs sm:text-sm font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Seja bem-vindo, <span className="text-emerald-500">{userName ? userName.trim().split(' ')[0] : ''}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 5. CONTEÚDO DAS ABAS (Com Transição Suave via Motion) */}
      <div className="pt-0">
        <AnimatePresence mode="wait">
          {/* ABA: AGENDA / VAGAS COM O SLIDER NO TOPO + HORÁRIOS HOJE + CADEIRAS AO VIVO + PRÓXIMOS 4 HORÁRIOS */}
          {activeTab === 'vagas' && (
            <motion.div
              key="aba-vagas"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-3"
            >
              {/* 3. SLIDER / CARROSSEL DA PÁGINA INICIAL */}
              <div className={`relative w-full h-[210px] sm:h-[240px] overflow-hidden shadow-md select-none touch-pan-y ${
                isDark ? 'bg-slate-900 border-y border-slate-800' : 'bg-slate-200 border-y border-slate-300'
              }`}>
                <AnimatePresence mode="wait">
                  {portfolioSlides.map((slide, idx) => {
                    if (idx !== activeSlideIndex) return null;
                    return (
                      <motion.div
                        key={slide.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -40 || info.velocity.x < -300) {
                            // Swipe para a esquerda -> Próximo slide
                            setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length);
                          } else if (info.offset.x > 40 || info.velocity.x > 300) {
                            // Swipe para a direita -> Slide anterior
                            setActiveSlideIndex((prev) => (prev - 1 + portfolioSlides.length) % portfolioSlides.length);
                          }
                        }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                      >
                        {/* Imagem de Fundo do Serviço Ampliada */}
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Degradê Linear Lateral e Inferior para legibilidade perfeita */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Conteúdo à Esquerda: Categoria + Título + Chamada Publicitária + Botão Agendar */}
                        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10 max-w-[80%] sm:max-w-[70%]">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1.5 backdrop-blur-xs">
                              {slide.tag}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight line-clamp-2 drop-shadow-xs font-['Poppins']">
                              {slide.title}
                            </h3>
                            <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-2 mt-1 drop-shadow-xs">
                              {slide.tagline}
                            </p>
                          </div>

                          {/* Botão Sutil "Agendar" */}
                          <div>
                            <button
                              onClick={() => handleOpenBooking(slide.service)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                            >
                              <span>Agendar Serviço</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Controles do Slide: Indicadores de Bolinhas no Canto Inferior Direito */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800/80 shadow-md">
                  {portfolioSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveSlideIndex(dotIdx)}
                      className={`transition-all rounded-full cursor-pointer ${
                        dotIdx === activeSlideIndex
                          ? 'w-4 h-1.5 bg-emerald-400'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Setas Sutis de Navegação */}
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev - 1 + portfolioSlides.length) % portfolioSlides.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer backdrop-blur-xs"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev + 1) % portfolioSlides.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-950/50 hover:bg-slate-950/90 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer backdrop-blur-xs"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Conteúdo Abaixo do Slide com Margens Internas */}
              <div className="px-3.5 space-y-3">
                {/* BOTÃO COM BORDAS EM 5px: "HORÁRIOS HOJE" (Gradiente Linear & Texto Branco Puro) */}
                <div>
                  <button
                    onClick={() => handleOpenBooking(undefined, true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 via-[#20C933] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-[5px] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_2px_10px_-2px_rgba(32,201,51,0.35)] border border-emerald-400/30 cursor-pointer active:scale-[0.99]"
                  >
                    <Calendar className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                    <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">HORÁRIOS HOJE</span>
                  </button>
                </div>
              {/* 1. SEÇÃO: CADEIRAS EM ATENDIMENTO AO VIVO (GRID DE CARDS SEM NOMES DE CLIENTES) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Cadeiras em Atendimento</span>
                  </h2>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Ao Vivo
                  </span>
                </div>

                {/* Grid de Cadeiras Ocupadas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeChairsData.map((chair) => {
                    const progressPercent = Math.min(100, Math.max(0, Math.round(((chair.totalMinutes - chair.remainingMinutes) / chair.totalMinutes) * 100)));

                    return (
                      <div
                        key={chair.id}
                        className={`border rounded-xl p-2.5 relative overflow-hidden transition-all shadow-xs flex flex-col justify-between ${
                          chair.isCurrentUser
                            ? isDark
                              ? 'bg-slate-900/95 border-emerald-500/70 ring-1 ring-emerald-500/30'
                              : 'bg-emerald-50/50 border-emerald-500/60 ring-1 ring-emerald-500/20'
                            : isDark
                              ? 'bg-slate-900/80 border-slate-800'
                              : 'bg-white border-slate-200/90'
                        }`}
                      >
                        {/* Topo do Card: Cadeira + Status */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`}>
                            {chair.number}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                            <Clock className="w-2.5 h-2.5" />
                            {chair.remainingMinutes}m
                          </span>
                        </div>

                        {/* Meio: Profissional Simples + Serviço */}
                        <div className="flex items-center gap-2 min-w-0 my-1">
                          <img
                            src={chair.avatar}
                            alt={chair.professional}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className={`text-[11px] font-bold truncate leading-tight ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              {chair.professional}
                            </h4>
                            <p className={`text-[9px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {chair.serviceTitle}
                            </p>
                          </div>
                        </div>

                        {/* Barra de Progresso e Previsão */}
                        <div className="mt-2 space-y-1">
                          <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400">
                            <span>Progresso</span>
                            <span>Até <strong>{chair.endTime}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. SEÇÃO: PRÓXIMOS HORÁRIOS LIVRES (GRID DE CARDS COM FOCO APENAS EM HORÁRIOS) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Próximos Horários Livres</span>
                  </h2>
                  <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                      : 'text-[#087A2A] bg-emerald-50 border-emerald-400/40'
                  }`}>
                    Hoje
                  </span>
                </div>

                {/* Grid de Horários */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {upcomingOpenSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => {
                        const matchedSrv = catalogServices.find((s) => s.title === slot.serviceTitle) || catalogServices[0];
                        handleOpenBooking(matchedSrv, true);
                      }}
                      className={`border rounded-xl p-2.5 flex flex-col justify-between gap-2 transition-all duration-200 cursor-pointer group shadow-xs active:scale-[0.98] ${
                        isDark
                          ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/60'
                          : 'bg-white border-slate-200/90 hover:border-emerald-500/60'
                      }`}
                    >
                      {/* Topo do Card: Horário Destaque */}
                      <div className="flex items-center justify-between">
                        <div className="w-full px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                          <span className="text-sm font-black block tracking-tight leading-none">{slot.timeSlot}</span>
                        </div>
                      </div>

                      {/* Profissional e Duração */}
                      <div className="min-w-0">
                        <span className={`text-[11px] font-bold block truncate ${
                          isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
                        }`}>
                          {slot.professionalName}
                        </span>
                        <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {slot.duration} • R${slot.price}
                        </span>
                      </div>

                      {/* Botão de Reserva Rápida */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const matchedSrv = catalogServices.find((s) => s.title === slot.serviceTitle) || catalogServices[0];
                          handleOpenBooking(matchedSrv, true);
                        }}
                        className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[10px] font-bold rounded-lg transition active:scale-95 uppercase tracking-wider text-center"
                      >
                        Reservar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {/* ABA: SEÇÃO SERVIÇOS -> GRID ESTILO PINTEREST MASONRY COM IMAGENS GRANDES E VARIADAS (Horizontal, Quadrado e Vertical) */}
          {activeTab === 'servicos' && (
            <motion.div
              key="aba-servicos"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-3.5 pt-1"
            >
              {/* Header da Seção de Serviços */}
              <div className="px-3.5 flex items-center justify-between">
                <h2 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Scissors className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Serviços & Procedimentos</span>
                </h2>
                <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {catalogServices.length} disponíveis
                </span>
              </div>

              {/* GRID ESTILO PINTEREST (Masonry em 2 Colunas com Espaçamento Mínimo, Cantos Sutis e Imagens Grandes) */}
              <div className="px-2">
                <div className="columns-2 gap-1.5 [column-fill:_balance]">
                  {catalogServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => handleOpenBooking(srv)}
                      className={`break-inside-avoid mb-1.5 relative rounded-[6px] overflow-hidden group cursor-pointer select-none transition-all duration-200 shadow-sm hover:shadow-lg active:scale-[0.98] border ${
                        isDark
                          ? 'bg-slate-900 border-slate-800/80 hover:border-emerald-500/60'
                          : 'bg-white border-slate-200 hover:border-emerald-500/60'
                      }`}
                      title={`${srv.title} - R$ ${srv.price}`}
                    >
                      {/* Contêiner de Imagem com Proporção Pinterest Dinâmica (Vertical 3:4/4:5, Quadrada 1:1 ou Horizontal 4:3) */}
                      <div className={`relative w-full overflow-hidden ${srv.aspectRatio || 'aspect-[4/5]'}`}>
                        <img
                          src={srv.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'}
                          alt={srv.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />

                        {/* Gradiente Superior para destacar a Categoria estilo Pinterest */}
                        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

                        {/* Badge de Categoria no Topo Esquerdo */}
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-black/60 backdrop-blur-md text-[9px] font-bold text-white border border-white/15 uppercase tracking-wider shadow-xs">
                            {srv.category}
                          </span>
                        </div>

                        {/* Botão de Ação / Ícone no Topo Direito */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="w-5.5 h-5.5 rounded-[4px] bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110">
                            <Scissors className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Gradiente Inferior com Contraste Perfeito para as Informações do Serviço */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 flex flex-col justify-end">
                          <h3 className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-xs line-clamp-2 font-['Poppins']">
                            {srv.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-400 drop-shadow-xs">
                              R${srv.price}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              {srv.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Agendamento Rápido na Aba de Serviços */}
              <div className="px-2 pt-1">
                <button
                  onClick={() => handleOpenBooking(undefined, true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 via-[#20C933] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-[5px] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_2px_10px_-2px_rgba(32,201,51,0.35)] border border-emerald-400/30 cursor-pointer active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">HORÁRIOS HOJE</span>
                </button>
              </div>
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
