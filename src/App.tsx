import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  X,
  PlusSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
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

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [offers] = useState<ServiceOffer[]>(MOCK_OFFERS);
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer>(MOCK_OFFERS[0]);
  const [bookings, setBookings] = useState<BookingAppointment[]>(INITIAL_BOOKINGS);
  const [lastBooking, setLastBooking] = useState<BookingAppointment>(INITIAL_BOOKINGS[0]);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Detect standalone mode (already installed as PWA)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for PWA beforeinstallprompt on Chromium browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
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

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsStandalone(true);
        setShowInstallModal(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show guide modal for iOS or manual browsers
      setShowInstallModal(true);
    }
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
    setCurrentScreen('confirmacao');
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
            />
          )}

          {currentScreen === 'mapa' && (
            <MapScreen
              offers={offers}
              onSelectOffer={(off) => {
                setSelectedOffer(off);
                setCurrentScreen('detalhe-oferta');
              }}
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
            />
          )}

          {currentScreen === 'detalhe-oferta' && (
            <OfferDetailScreen
              offer={selectedOffer}
              onBack={() => setCurrentScreen('home')}
              onConfirmBooking={handleConfirmBooking}
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
            />
          )}

          {currentScreen === 'perfil' && (
            <ProfileScreen
              onInstallClick={handleInstallApp}
              isInstallable={isInstallable || isIOS}
              isStandalone={isStandalone}
            />
          )}
        </div>

        {/* Global Bottom Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
        />

        {/* PWA Install Modal Guide */}
        {showInstallModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                    V
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Instalar o App Vagou</h3>
                    <p className="text-xs text-slate-500">Acesso rápido na tela inicial do seu celular</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isIOS ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    Como instalar no iPhone / iPad (Safari):
                  </p>
                  <ol className="space-y-2 list-decimal list-inside pl-1 text-slate-600 leading-relaxed">
                    <li>
                      Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-1" /> na barra inferior do Safari.
                    </li>
                    <li>
                      Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-1" />.
                    </li>
                    <li>
                      Toque em <strong>"Adicionar"</strong> no canto superior direito.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    Como instalar no Android (Chrome):
                  </p>
                  <ol className="space-y-2 list-decimal list-inside pl-1 text-slate-600 leading-relaxed">
                    <li>
                      Toque nos <strong>três pontinhos ⋮</strong> no canto superior do Chrome.
                    </li>
                    <li>
                      Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                    </li>
                  </ol>
                </div>
              )}

              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full py-3 bg-[#20C933] hover:bg-[#087A2A] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
