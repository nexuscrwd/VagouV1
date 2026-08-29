import React, { useState, useEffect } from 'react';
import { ScreenId, ServiceOffer, BookingAppointment } from './types';
import { MOCK_OFFERS, INITIAL_BOOKINGS } from './data';
import { HomeScreen } from './components/HomeScreen';
import { MapScreen } from './components/MapScreen';
import { OfferListScreen } from './components/OfferListScreen';
import { OfferDetailScreen } from './components/OfferDetailScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { InstallModal } from './components/InstallModal';
import { scheduleAppointmentReminder } from './utils/notifications';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [offers] = useState<ServiceOffer[]>(MOCK_OFFERS);
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer>(MOCK_OFFERS[0]);
  const [bookings, setBookings] = useState<BookingAppointment[]>(INITIAL_BOOKINGS);
  const [lastBooking, setLastBooking] = useState<BookingAppointment>(INITIAL_BOOKINGS[0]);

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

  // Handle Booking creation
  const handleConfirmBooking = (offer: ServiceOffer) => {
    const newBooking: BookingAppointment = {
      protocolCode: `#VGA-${Math.floor(10000 + Math.random() * 90000)}`,
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

    // Trigger PWA reminder notification
    scheduleAppointmentReminder(
      offer.serviceTitle,
      offer.salonName,
      offer.timeSlot
    );

    setCurrentScreen('confirmacao');
  };

  // Handle Booking Cancellation
  const handleCancelBooking = (protocolCode: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.protocolCode === protocolCode
          ? { ...b, status: 'CANCELADO' as const }
          : b
      )
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[#151A1E] sm:bg-slate-200 flex justify-center items-start antialiased selection:bg-emerald-500 selection:text-white">
      {/* Real Fullscreen Mobile Container */}
      <main className="w-full max-w-md min-h-[100dvh] bg-white text-slate-900 flex flex-col relative shadow-2xl overflow-x-hidden font-sans">
        
        {/* Main Screen Content */}
        <div className="flex-1 w-full relative overflow-y-auto">
          {currentScreen === 'home' && (
            <HomeScreen
              offers={offers}
              onNavigateToOffers={(q, cat) => setCurrentScreen('lista-ofertas')}
              onNavigateToOfferDetail={(off) => {
                setSelectedOffer(off);
                setCurrentScreen('detalhe-oferta');
              }}
              onNavigateToMap={() => setCurrentScreen('mapa')}
              onOpenInstallModal={handleOpenInstallModal}
              isStandalone={isStandalone}
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
            />
          )}
        </div>

        {/* Global Bottom Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
        />

        {/* Universal Multi-Browser Install Modal */}
        <InstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          onNativeInstall={handleNativeInstall}
          hasNativePrompt={!!deferredPrompt}
        />
      </main>
    </div>
  );
};

export default App;
