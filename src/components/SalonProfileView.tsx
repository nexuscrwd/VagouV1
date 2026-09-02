import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Clock, ShieldCheck, 
  Share2, Heart, Zap, CheckCircle2, Scissors, 
  Calendar, Award, Coffee, Wifi, Car, Wind, Home
} from 'lucide-react';
import { ServiceOffer } from '../types';
import { SalonBookingModal, CatalogServiceItem } from './SalonBookingModal';
import { formatSlotDateTime } from '../utils/dateFormatter';

interface SalonProfileViewProps {
  salonName: string;
  offers: ServiceOffer[];
  onBack: () => void;
  onSelectOffer: (offer: ServiceOffer) => void;
  onDirectBook: (offer: ServiceOffer) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (salonName: string) => void;
}

export const SalonProfileView: React.FC<SalonProfileViewProps> = ({
  salonName,
  offers,
  onBack,
  onSelectOffer,
  onDirectBook,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'vagas' | 'servicos' | 'sobre' | 'avaliacoes'>('vagas');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingService, setBookingService] = useState<CatalogServiceItem | null>(null);

  // Filter all offers belonging to this salon
  const salonOffers = offers.filter((o) => o.salonName === salonName);
  const primaryOffer = salonOffers[0] || offers[0];

  // Derive salon information
  const salonInfo = {
    name: salonName,
    avatar: primaryOffer?.professionalAvatar || primaryOffer?.imageUrl,
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
    reviews: [
      {
        id: 'r1',
        author: 'Guilherme Mendes',
        rating: 5,
        date: 'Há 2 dias',
        comment: 'Atendimento impecável! Peguei a vaga pelo radar e cheguei no horário. O café e o corte foram nota 10.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'r2',
        author: 'Renato Faria',
        rating: 5,
        date: 'Há 5 dias',
        comment: 'Barba na toalha quente sensacional. Ambiente muito limpo e profissionais pontuais.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
      }
    ]
  };

  // Full catalog of services for this salon
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

  const handleOpenBooking = (srv?: CatalogServiceItem) => {
    setBookingService(srv || catalogServices[0]);
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
        duration: bookingData.service.duration,
        professionalName: bookingData.professional,
        professionalAvatar: bookingData.professionalAvatar || primaryOffer.professionalAvatar,
        timeSlot: `${bookingData.dateFormatted} às ${bookingData.timeSlot}`,
        dayLabel: bookingData.dateFormatted,
        serviceCategory: (bookingData.service.category.toLowerCase().includes('barba') ? 'barba' : 'cabelo') as any,
      });
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen pb-24">
      {/* 1. Header Próprio do Estabelecimento / Capa Super Compacta */}
      <div className="relative w-full h-24 sm:h-28 bg-slate-900 overflow-hidden">
        <img
          src={salonInfo.coverImage}
          alt={salonInfo.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />

        {/* Top Control Buttons */}
        <div className="absolute top-2.5 inset-x-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 transition text-[11px] font-bold shadow-lg active:scale-95 cursor-pointer"
              title="Voltar ao Radar"
              aria-label="Voltar para a página anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#20C933]" />
              <span>Voltar</span>
            </button>
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-800 transition shadow-lg active:scale-95 cursor-pointer"
              title="Tela Inicial"
              aria-label="Ir para a tela inicial"
            >
              <Home className="w-3.5 h-3.5 text-slate-200" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite?.(salonInfo.name)}
              className="w-7 h-7 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-800 transition shadow-lg active:scale-95 cursor-pointer"
              aria-label="Favoritar salão"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: salonInfo.name, url: window.location.href }).catch(() => {});
                }
              }}
              className="w-7 h-7 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-800 transition shadow-lg active:scale-95 cursor-pointer"
              aria-label="Compartilhar salão"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Informações Principais do Estabelecimento */}
      <div className="px-4 -mt-5 relative z-20">
        <div className="flex items-end gap-3">
          {/* Avatar com anel de destaque */}
          <div className="relative w-16 h-16 rounded-xl ring-3 ring-slate-950 overflow-hidden bg-slate-900 shadow-xl flex-shrink-0">
            {salonInfo.avatar ? (
              <img
                src={salonInfo.avatar}
                alt={salonInfo.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center text-white font-bold text-lg">
                {salonInfo.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#20C933] border-2 border-slate-950" />
          </div>

          <div className="flex-1 min-w-0 pb-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white font-['Poppins'] leading-tight truncate">
                {salonInfo.name}
              </h1>
              {salonInfo.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#20C933] flex-shrink-0" title="Estabelecimento Verificado" />
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-300">
              <span className="flex items-center gap-0.5 font-bold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {salonInfo.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">({salonInfo.reviewsCount} avaliações)</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {salonInfo.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Localização e Horário */}
        <div className="mt-3 flex flex-col gap-1 bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#20C933] flex-shrink-0" />
            <span className="truncate">{salonInfo.address}, {salonInfo.city}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{salonInfo.hours}</span>
          </div>
        </div>

        {/* Botão de Ação Rápida */}
        <div className="mt-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonInfo.name + ' ' + salonInfo.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#20C933]" />
            <span>Como Chegar</span>
          </a>
        </div>
      </div>

      {/* 3. Navegação por Abas do Perfil */}
      <div className="mt-5 px-4 sticky top-14 z-30 bg-slate-950/95 backdrop-blur-md pt-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'vagas', label: `⚡ Vagas Hoje (${salonOffers.length})` },
            { id: 'servicos', label: '✂️ Todos os Serviços' },
            { id: 'sobre', label: '🏢 Sobre & Equipe' },
            { id: 'avaliacoes', label: `⭐ Avaliações (${salonInfo.reviewsCount})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-['Poppins'] flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#20C933] text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Conteúdo das Abas */}
      <div className="px-4 mt-4">
        {/* ABA: VAGAS IMEDIATAS / RADAR */}
        {activeTab === 'vagas' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Poppins'] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#20C933] fill-[#20C933]" />
                <span>Horários Disponíveis Hoje no Radar</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">Reserva Instantânea</span>
            </div>

            {salonOffers.length > 0 ? (
              salonOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => onSelectOffer(offer)}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-300 shadow-md relative overflow-hidden group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                          {formatSlotDateTime(offer.timeSlot)}
                        </span>
                        {offer.expiresInMinutes && (
                          <span className="text-[11px] text-rose-400 font-bold">
                            Expira em {offer.expiresInMinutes} min
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white mt-1.5 group-hover:text-emerald-300 transition-colors">
                        {offer.serviceTitle}
                      </h4>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Com <strong className="text-slate-200">{offer.professionalName}</strong> • {offer.duration}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 flex flex-col items-end">
                      <span className="text-xs font-black text-emerald-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#20C933]" />
                        <span>{formatSlotDateTime(offer.timeSlot)}</span>
                      </span>
                      {offer.originalPrice && offer.originalPrice > offer.price && (
                        <span className="text-[10px] text-slate-400 line-through block mt-0.5">
                          R${offer.originalPrice.toFixed(0)}
                        </span>
                      )}
                      <span className="text-base font-black text-emerald-400">
                        R${offer.price.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#20C933]" />
                      Sem fila de espera
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDirectBook(offer);
                      }}
                      className="px-4 py-2 bg-[#20C933] hover:bg-[#1bb32d] active:scale-95 text-slate-950 text-xs font-black rounded-xl transition shadow-md uppercase tracking-wider flex items-center gap-1.5 font-['Poppins'] cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Agendar Agora</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">Sem vagas imediatas abertas no momento</p>
                <p className="text-xs text-slate-400 mt-1">Consulte a agenda do salão para novos agendamentos.</p>
                <button
                  onClick={() => handleOpenBooking()}
                  className="mt-3.5 px-4 py-2 bg-[#20C933] hover:bg-[#1bb32d] text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-950" />
                  <span>Ver Agenda e Horários Livres</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ABA: TODOS OS SERVIÇOS */}
        {activeTab === 'servicos' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Poppins'] flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-[#20C933]" />
                <span>Cardápio Completo de Atendimentos</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">Agenda do Salão</span>
            </div>

            {catalogServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleOpenBooking(srv)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-emerald-500/50 transition cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#20C933] bg-emerald-950/60 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {srv.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">{srv.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{srv.description}</p>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  <span className="text-base font-black text-emerald-400">
                    R${srv.price.toFixed(0)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBooking(srv);
                    }}
                    className="mt-2 px-3 py-1.5 bg-emerald-950/80 hover:bg-[#20C933] hover:text-slate-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Agendar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA: SOBRE & EQUIPE */}
        {activeTab === 'sobre' && (
          <div className="space-y-4">
            {/* Descrição */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white font-['Poppins'] mb-2">Sobre o Espaço</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{salonInfo.description}</p>
            </div>

            {/* Comodidades */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white font-['Poppins'] mb-3">Comodidades & Diferenciais</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {salonInfo.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                    <amenity.icon className="w-4 h-4 text-[#20C933]" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipe / Profissionais */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white font-['Poppins'] mb-3">Profissionais da Equipe</h3>
              <div className="space-y-2.5">
                {salonInfo.professionals.map((prof, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{prof.name}</h4>
                        <p className="text-[11px] text-slate-400">{prof.role}</p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {prof.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA: AVALIAÇÕES */}
        {activeTab === 'avaliacoes' && (
          <div className="space-y-3.5">
            {/* Card de Resumo das Avaliações */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-amber-400 font-['Poppins']">
                  {salonInfo.rating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Baseado em {salonInfo.reviewsCount} atendimentos verificados
                  </span>
                </div>
              </div>
              <Award className="w-8 h-8 text-[#20C933]" />
            </div>

            {/* Lista de Avaliações */}
            {salonInfo.reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-bold text-white">{rev.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
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
        onConfirmAppointment={handleConfirmSchedule}
      />
    </div>
  );
};
