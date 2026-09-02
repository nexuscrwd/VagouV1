import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  PartnerScreenId,
  AppMode,
  ServiceOffer,
  BookingAppointment,
  PartnerProfessional,
  PartnerAppointmentItem,
  DayScheduleConfig,
} from './types';
import {
  MOCK_OFFERS,
  INITIAL_BOOKINGS,
  INITIAL_PROFESSIONALS,
  INITIAL_PARTNER_APPOINTMENTS,
} from './data';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { MapScreen } from './components/MapScreen';
import { OfferListScreen } from './components/OfferListScreen';
import { OfferDetailScreen } from './components/OfferDetailScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { InterestOnboardingModal } from './components/InterestOnboardingModal';
import { InstallModal } from './components/InstallModal';
import { PartnerAgendaScreen } from './components/PartnerAgendaScreen';
import { PartnerScheduleConfigScreen } from './components/PartnerScheduleConfigScreen';
import { PartnerProfileScreen } from './components/PartnerProfileScreen';
import { PartnerPublishModal } from './components/PartnerPublishModal';
import { PartnerBottomNav } from './components/PartnerBottomNav';
import { SplashScreen } from './components/SplashScreen';
import { scheduleAppointmentReminder } from './utils/notifications';

export const App: React.FC = () => {
  // App Mode: 'client' (User looking for appointment) or 'partner' (Salon Owner / Professional)
  const [appMode, setAppMode] = useState<AppMode>('client');

  // Client Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [offers, setOffers] = useState<ServiceOffer[]>(MOCK_OFFERS);
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer>(MOCK_OFFERS[0]);
  const [bookings, setBookings] = useState<BookingAppointment[]>(INITIAL_BOOKINGS);
  const [lastBooking, setLastBooking] = useState<BookingAppointment>(INITIAL_BOOKINGS[0]);

  // Profile Drawer & Netflix Profile Segment & Search Modal
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [userSegment, setUserSegment] = useState<'barbearia' | 'salao' | 'todos'>(() => {
    try {
      const saved = localStorage.getItem('vagou_user_segment');
      return (saved as 'barbearia' | 'salao' | 'todos') || 'barbearia';
    } catch {
      return 'barbearia';
    }
  });

  const handleSelectSegment = (segment: 'barbearia' | 'salao' | 'todos') => {
    setUserSegment(segment);
    try {
      localStorage.setItem('vagou_user_segment', segment);
    } catch {}
  };

  const handleSaveInterestPreferences = (selectedIds: string[]) => {
    if (selectedIds.includes('barbearia') && !selectedIds.includes('salao')) {
      handleSelectSegment('barbearia');
    } else if (selectedIds.includes('salao') && !selectedIds.includes('barbearia')) {
      handleSelectSegment('salao');
    } else {
      handleSelectSegment('todos');
    }
    try {
      localStorage.setItem('vagou_user_interests', JSON.stringify(selectedIds));
      localStorage.setItem('vagou_onboarding_completed', 'true');
    } catch {}
  };

  // Partner Navigation State
  const [partnerScreen, setPartnerScreen] = useState<PartnerScreenId>('partner-agenda');
  const [professionals, setProfessionals] = useState<PartnerProfessional[]>(INITIAL_PROFESSIONALS);
  const [partnerAppointments, setPartnerAppointments] = useState<PartnerAppointmentItem[]>(
    INITIAL_PARTNER_APPOINTMENTS
  );
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [publishPrefill, setPublishPrefill] = useState<{
    professionalId?: string;
    time?: string;
    date?: string;
  } | undefined>(undefined);

  // Global Favorites State with LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vagou_favorites');
      return saved ? JSON.parse(saved) : ['1', '3'];
    } catch {
      return ['1', '3'];
    }
  });

  const handleToggleFavorite = (offerId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(offerId);
      const next = exists ? prev.filter((id) => id !== offerId) : [...prev, offerId];
      try {
        localStorage.setItem('vagou_favorites', JSON.stringify(next));
      } catch (err) {
        console.warn('Erro ao salvar favoritos:', err);
      }
      return next;
    });
  };

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setShowInstallModal(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsStandalone(true);
          setShowInstallModal(false);
        }
      } catch (err) {
        console.log('Error triggering prompt:', err);
      }
      setDeferredPrompt(null);
    }
  };

  const handleOpenInstallModal = () => {
    setShowInstallModal(true);
  };

  // Handle Client Booking creation
  const handleConfirmBooking = (offer: ServiceOffer) => {
    const newProtocol = `#VGA-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: BookingAppointment = {
      protocolCode: newProtocol,
      service: offer.serviceTitle,
      professional: offer.professionalName,
      salonName: offer.salonName,
      dateTime: offer.timeSlot,
      dayGroup: 'HOJE, 26 DE JAN',
      time: offer.timeSlot.replace('Hoje • ', '').replace('Amanhã • ', ''),
      totalPrice: offer.price,
      status: 'EM ANDAMENTO',
      address: `${offer.neighborhood} - São Paulo, SP`,
    };

    setBookings([newBooking, ...bookings]);
    setLastBooking(newBooking);

    // Also mirror to Partner Agenda if it's the partner's salon!
    const todayIso = new Date().toISOString().split('T')[0];
    const matchingProf = professionals.find((p) => p.name.includes(offer.professionalName)) || professionals[0];
    const newPartnerAppt: PartnerAppointmentItem = {
      id: `partner-appt-${Date.now()}`,
      protocolCode: newProtocol,
      professionalId: matchingProf.id,
      professionalName: matchingProf.name,
      clientName: 'Anderson Silva (Você)',
      clientPhone: '+5511987654321',
      serviceTitle: offer.serviceTitle,
      serviceCategory: offer.serviceCategory,
      price: offer.price,
      dateStr: todayIso,
      startTime: offer.timeSlot.replace('Hoje • ', '').replace('Amanhã • ', ''),
      endTime: '15:15',
      status: 'CONFIRMADO',
      notes: 'Agendamento imediato realizado pelo app do cliente.',
    };
    setPartnerAppointments((prev) => [newPartnerAppt, ...prev]);

    // Trigger PWA reminder notification
    scheduleAppointmentReminder(
      offer.serviceTitle,
      offer.salonName,
      offer.timeSlot
    );

    setCurrentScreen('confirmacao');
  };

  // Handle Client Booking Cancellation
  const handleCancelBooking = (protocolCode: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.protocolCode === protocolCode
          ? { ...b, status: 'CANCELADO' as const }
          : b
      )
    );
    // Also update partner side
    setPartnerAppointments((prev) =>
      prev.map((b) =>
        b.protocolCode === protocolCode
          ? { ...b, status: 'CANCELADO' as const }
          : b
      )
    );
  };

  // Handle Partner Schedule & Breaks Save
  const handleSavePartnerSchedule = (
    targetId: string | 'all',
    schedule: DayScheduleConfig[],
    slotDuration: number
  ) => {
    setProfessionals((prev) =>
      prev.map((prof) => {
        if (targetId === 'all' || prof.id === targetId) {
          return {
            ...prof,
            schedule: JSON.parse(JSON.stringify(schedule)),
            slotDurationMinutes: slotDuration,
            useCustomSchedule: targetId !== 'all',
          };
        }
        return prof;
      })
    );
  };

  // Handle Partner Add New Professional
  const handleAddProfessional = (newProfData: Omit<PartnerProfessional, 'id'>) => {
    const newProf: PartnerProfessional = {
      ...newProfData,
      id: `prof-${Date.now()}`,
    };
    setProfessionals((prev) => [...prev, newProf]);
  };

  // Handle Partner Appointment Status Update (Check-in, Concluido, No-Show, etc.)
  const handleUpdatePartnerAppointmentStatus = (
    id: string,
    status: PartnerAppointmentItem['status']
  ) => {
    setPartnerAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Handle Partner Publishing a Quick Flash Offer
  const handlePublishOffer = (newOfferData: {
    professionalId: string;
    professionalName: string;
    serviceTitle: string;
    serviceCategory: 'cabelo' | 'barba' | 'unhas' | 'beleza' | 'estetica';
    price: number;
    originalPrice: number;
    timeSlot: string;
    dayLabel: string;
    duration: string;
    dateIso: string;
  }) => {
    const newOfferId = `off-flash-${Date.now()}`;
    const newServiceOffer: ServiceOffer = {
      id: newOfferId,
      salonName: 'Salão & Barbearia Xpress',
      professionalName: newOfferData.professionalName,
      serviceTitle: newOfferData.serviceTitle,
      serviceCategory: newOfferData.serviceCategory,
      price: newOfferData.price,
      originalPrice: newOfferData.originalPrice,
      rating: 4.9,
      ratingCount: 128,
      distance: '650 metros de você',
      neighborhood: 'Itaquera, São Paulo',
      timeSlot: newOfferData.timeSlot,
      dayLabel: newOfferData.dayLabel,
      duration: newOfferData.duration,
      imageUrl:
        newOfferData.serviceCategory === 'barba'
          ? 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'
          : newOfferData.serviceCategory === 'unhas'
          ? 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      lat: -23.535,
      lng: -46.452,
      featured: true,
    };

    // Add to Client offers list
    setOffers((prev) => [newServiceOffer, ...prev]);

    // Add to Partner appointment list as VAGA_PUBLICADA
    const newPartnerAppt: PartnerAppointmentItem = {
      id: `appt-flash-${Date.now()}`,
      protocolCode: `#VGA-FLASH-${Math.floor(100 + Math.random() * 900)}`,
      professionalId: newOfferData.professionalId,
      professionalName: newOfferData.professionalName,
      clientName: 'Vaga Aberta no Vagou',
      clientPhone: '',
      serviceTitle: newOfferData.serviceTitle,
      serviceCategory: newOfferData.serviceCategory,
      price: newOfferData.price,
      dateStr: newOfferData.dateIso,
      startTime: newOfferData.timeSlot.replace('Hoje • ', '').replace('Amanhã • ', ''),
      endTime: '16:15',
      status: 'VAGA_PUBLICADA',
      notes: 'Oferta relâmpago publicada!',
    };
    setPartnerAppointments((prev) => [newPartnerAppt, ...prev]);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#151A1E] sm:bg-slate-200 flex justify-center items-center antialiased selection:bg-[#20C933] selection:text-slate-950 overflow-hidden">
      {/* Real Fullscreen Mobile Container */}
      <main className="w-full max-w-md h-[100dvh] bg-slate-950 text-slate-100 flex flex-col relative shadow-2xl overflow-hidden font-sans">
        
        {/* CLIENT MODE SCREENS */}
        {appMode === 'client' && (
          <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Scrollable Screen Content Container */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative bg-slate-950">
              {currentScreen === 'home' && (
                <HomeScreen
                  offers={offers}
                  onNavigateToOffers={() => setCurrentScreen('busca')}
                  onNavigateToOfferDetail={(off) => {
                    setSelectedOffer(off);
                    setCurrentScreen('detalhe-oferta');
                  }}
                  onNavigateToMap={() => setCurrentScreen('mapa')}
                  onOpenInstallModal={handleOpenInstallModal}
                  isStandalone={isStandalone}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onConfirmBooking={handleConfirmBooking}
                  onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
                  onOpenSearchModal={() => setIsSearchModalOpen(true)}
                  currentSegment={userSegment}
                  onSelectSegment={handleSelectSegment}
                  onSwitchToPartnerMode={() => {
                    setAppMode('partner');
                    setPartnerScreen('partner-agenda');
                  }}
                />
              )}

              {currentScreen === 'busca' && (
                <SearchScreen
                  offers={offers}
                  onSelectOffer={(off) => {
                    setSelectedOffer(off);
                    setCurrentScreen('detalhe-oferta');
                  }}
                  onConfirmBooking={handleConfirmBooking}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentScreen === 'mapa' && (
                <MapScreen
                  offers={offers}
                  onSelectOffer={(off) => {
                    setSelectedOffer(off);
                    setCurrentScreen('detalhe-oferta');
                  }}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentScreen === 'lista-ofertas' && (
                <OfferListScreen
                  offers={offers}
                  onBack={() => setCurrentScreen('home')}
                  onSelectOffer={(off) => {
                    setSelectedOffer(off);
                    setCurrentScreen('detalhe-oferta');
                  }}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentScreen === 'detalhe-oferta' && (
                <OfferDetailScreen
                  offer={selectedOffer}
                  onBack={() => setCurrentScreen('home')}
                  onConfirmBooking={handleConfirmBooking}
                  isFavorite={favorites.includes(selectedOffer.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentScreen === 'confirmacao' && (
                <ConfirmationScreen
                  booking={lastBooking}
                  onNavigateToAgenda={() => setCurrentScreen('agenda')}
                />
              )}

              {currentScreen === 'agenda' && (
                <AgendaScreen
                  bookings={bookings}
                  onNewBookingClick={() => setCurrentScreen('home')}
                  onCancelBooking={handleCancelBooking}
                />
              )}

              {currentScreen === 'perfil' && (
                <ProfileScreen
                  onInstallClick={handleOpenInstallModal}
                  isInstallable={true}
                  isStandalone={isStandalone}
                  offers={offers}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectOffer={(off) => {
                    setSelectedOffer(off);
                    setCurrentScreen('detalhe-oferta');
                  }}
                  onSwitchToPartnerMode={() => {
                    setAppMode('partner');
                    setPartnerScreen('partner-agenda');
                  }}
                />
              )}
            </div>

            {/* Client Bottom Navigation - Fixed and Permanent at bottom */}
            <BottomNav
              currentScreen={currentScreen}
              onSelectScreen={(screen) => setCurrentScreen(screen)}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />

            {/* Profile Drawer Component */}
            <ProfileDrawer
              isOpen={isProfileDrawerOpen}
              onClose={() => setIsProfileDrawerOpen(false)}
              onNavigateToAgenda={() => setCurrentScreen('agenda')}
              onSwitchToPartnerMode={() => {
                setAppMode('partner');
                setPartnerScreen('partner-agenda');
              }}
              onOpenInterestConfig={() => setIsInterestModalOpen(true)}
              currentSegment={userSegment}
              onSelectSegment={handleSelectSegment}
            />

            {/* Interest Onboarding / Personalization Modal */}
            <InterestOnboardingModal
              isOpen={isInterestModalOpen}
              onClose={() => setIsInterestModalOpen(false)}
              onSavePreferences={handleSaveInterestPreferences}
            />

            {/* Center Search Modal with Backdrop Blur */}
            <SearchModal
              isOpen={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
              offers={offers}
              onSelectOffer={(off) => {
                setSelectedOffer(off);
                setCurrentScreen('detalhe-oferta');
              }}
              onConfirmBooking={handleConfirmBooking}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* PARTNER / ESTABELECIMENTO MODE SCREENS */}
        {appMode === 'partner' && (
          <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Scrollable Screen Content Container for Partner */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
              {partnerScreen === 'partner-agenda' && (
                <PartnerAgendaScreen
                  appointments={partnerAppointments}
                  professionals={professionals}
                  onOpenPublishModal={(prefill) => {
                    setPublishPrefill(prefill);
                    setIsPublishModalOpen(true);
                  }}
                  onUpdateAppointmentStatus={handleUpdatePartnerAppointmentStatus}
                  onNavigateToScheduleConfig={() => setPartnerScreen('partner-schedule-config')}
                />
              )}

              {partnerScreen === 'partner-publish' && (
                <PartnerAgendaScreen
                  appointments={partnerAppointments}
                  professionals={professionals}
                  onOpenPublishModal={(prefill) => {
                    setPublishPrefill(prefill);
                    setIsPublishModalOpen(true);
                  }}
                  onUpdateAppointmentStatus={handleUpdatePartnerAppointmentStatus}
                  onNavigateToScheduleConfig={() => setPartnerScreen('partner-schedule-config')}
                />
              )}

              {partnerScreen === 'partner-schedule-config' && (
                <PartnerScheduleConfigScreen
                  professionals={professionals}
                  onSaveSchedule={handleSavePartnerSchedule}
                  onAddProfessional={handleAddProfessional}
                  onBack={() => setPartnerScreen('partner-agenda')}
                />
              )}

              {partnerScreen === 'partner-profile' && (
                <PartnerProfileScreen
                  professionals={professionals}
                  onSwitchToClientMode={() => {
                    setAppMode('client');
                    setCurrentScreen('home');
                  }}
                  onNavigateToScheduleConfig={() => setPartnerScreen('partner-schedule-config')}
                  onOpenPublishModal={() => {
                    setPublishPrefill(undefined);
                    setIsPublishModalOpen(true);
                  }}
                />
              )}
            </div>

            {/* Partner Bottom Navigation - Fixed and Permanent at bottom */}
            <PartnerBottomNav
              currentScreen={partnerScreen}
              onSelectScreen={(screen) => {
                if (screen === 'partner-publish') {
                  setPublishPrefill(undefined);
                  setIsPublishModalOpen(true);
                } else {
                  setPartnerScreen(screen);
                }
              }}
            />
          </div>
        )}

        {/* Universal Multi-Browser Install Modal */}
        <InstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          onNativeInstall={handleNativeInstall}
          hasNativePrompt={!!deferredPrompt}
        />

        {/* Quick Flash Offer Publish Modal (Partner) */}
        <PartnerPublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          professionals={professionals}
          onPublishOffer={handlePublishOffer}
          initialPrefill={publishPrefill}
        />

        {/* Official Brand Splash Screen (Manual de Identidade Visual) */}
        <SplashScreen durationMs={1400} />
      </main>
    </div>
  );
};

export default App;

