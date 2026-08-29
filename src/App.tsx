import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Smartphone,
  Layers,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  QrCode,
  ExternalLink,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  X,
  Share2,
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

  // Mode: Native Mobile (fullscreen standalone) vs Studio Desktop (with inspector & frame)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mobile') === 'true') return true;
      return window.innerWidth < 768;
    }
    return false;
  });

  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showQuickScreenBar, setShowQuickScreenBar] = useState<boolean>(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl.includes('?') ? `${currentUrl}&mobile=true` : `${currentUrl}?mobile=true`
  )}`;

  const handleCopyLink = () => {
    const urlToCopy = currentUrl.includes('?') ? `${currentUrl}&mobile=true` : `${currentUrl}?mobile=true`;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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

  const screenNames: Record<ScreenId, string> = {
    home: '1. vagou-home (Início)',
    mapa: '2. vagou-mapa (Explorar Mapa)',
    'lista-ofertas': '3. vagou-lista-ofertas (Listagem)',
    'detalhe-oferta': '4. vagou-detalhe-oferta (Detalhes)',
    confirmacao: '5. vagou-confirmacao (Sucesso)',
    agenda: '6. vagou-agenda (Minha Agenda)',
    perfil: '7. vagou-perfil (Perfil)',
  };

  // --------------------------------------------------------------------------
  // 1. NATIVE MOBILE MODE (100% Fullscreen, no borders or desktop mockup wrapper)
  // --------------------------------------------------------------------------
  if (isMobileMode) {
    return (
      <div className="w-full min-h-[100dvh] bg-white text-slate-900 flex flex-col relative select-none font-sans overflow-x-hidden">
        {/* Floating Quick Action Badge */}
        <div className="fixed top-2 right-2 z-50 flex items-center gap-1.5">
          <button
            onClick={() => setShowQuickScreenBar(!showQuickScreenBar)}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold shadow-lg border border-white/20 flex items-center gap-1 hover:bg-slate-900 transition"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Telas</span>
          </button>

          <button
            onClick={() => setIsMobileMode(false)}
            title="Voltar ao modo Studio"
            className="p-1.5 rounded-full bg-slate-900/80 backdrop-blur text-white shadow-lg border border-white/20 hover:bg-slate-900 transition"
          >
            <Minimize2 className="w-3 h-3 text-slate-300" />
          </button>
        </div>

        {/* Quick Screen Switcher Overlay Drawer */}
        {showQuickScreenBar && (
          <div className="fixed inset-x-2 top-12 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-300">Trocar Tela do Figma:</span>
              <button
                onClick={() => setShowQuickScreenBar(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['home', 'mapa', 'lista-ofertas', 'detalhe-oferta', 'confirmacao', 'agenda', 'perfil'] as ScreenId[]).map((scr) => (
                <button
                  key={scr}
                  onClick={() => {
                    if (scr === 'detalhe-oferta') setSelectedOffer(offers[0]);
                    setCurrentScreen(scr);
                    setShowQuickScreenBar(false);
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                    currentScreen === scr
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{scr.replace('-', ' ')}</span>
                  {currentScreen === scr && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen Content Container */}
        <div className="flex-1 w-full max-w-md mx-auto relative overflow-y-auto pb-16">
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

          {currentScreen === 'perfil' && <ProfileScreen />}
        </div>

        {/* Global Native Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <BottomNav
            currentScreen={currentScreen}
            onSelectScreen={(screen) => setCurrentScreen(screen)}
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. STUDIO DESKTOP MODE (With phone frame mockup, inspector & QR test)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans">
      {/* Top Header & Screen Quick Selector */}
      <header className="w-full max-w-5xl mb-4 sm:mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">Vagou App</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Figma 1:1 Funcional
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Protótipo interativo completo das 6 telas desenvolvidas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Mobile Mode Toggle */}
          <button
            id="btn-toggle-fullscreen-mobile"
            onClick={() => setIsMobileMode(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Smartphone className="w-4 h-4" />
            <span>Modo Celular (Tela Cheia)</span>
          </button>

          {/* QR Code Button */}
          <button
            onClick={() => setShowQRModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Testar no Aparelho</span>
          </button>
        </div>
      </header>

      {/* Screen Switcher Pills */}
      <div className="w-full max-w-5xl mb-4 flex items-center gap-1.5 flex-wrap justify-center bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl">
        <span className="text-[11px] font-bold text-slate-400 mr-2">Telas:</span>
        {(['home', 'mapa', 'lista-ofertas', 'detalhe-oferta', 'confirmacao', 'agenda', 'perfil'] as ScreenId[]).map((scr) => (
          <button
            key={scr}
            id={`screen-btn-${scr}`}
            onClick={() => {
              if (scr === 'detalhe-oferta') setSelectedOffer(offers[0]);
              setCurrentScreen(scr);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentScreen === scr
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>{scr.replace('-', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center: Mobile Device Frame (390 x 844) */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="w-full max-w-[390px] h-[800px] sm:h-[844px] bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-800 flex flex-col overflow-hidden relative select-none">
            {/* iOS Status Bar */}
            <div className="h-10 bg-transparent px-6 pt-2 flex items-center justify-between text-slate-900 text-xs font-bold z-30 shrink-0">
              <span>9:41</span>
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto -mt-1 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Screen Content Container */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar">
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

              {currentScreen === 'perfil' && <ProfileScreen />}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full z-40 pointer-events-none" />

            {/* Global Bottom Navigation */}
            <BottomNav
              currentScreen={currentScreen}
              onSelectScreen={(screen) => setCurrentScreen(screen)}
            />
          </div>
        </div>

        {/* Right Column: Architecture, User Flow & Testing Options */}
        <div className="lg:col-span-6 space-y-4">
          {/* Direct Mobile Test Highlight */}
          <div className="bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Como testar no seu celular:</h3>
                <p className="text-xs text-emerald-200">
                  Experimente o app em tela cheia sem as bordas de computador
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsMobileMode(true)}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Abrir Tela Cheia Aqui</span>
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Escanear QR Code</span>
              </button>
            </div>
          </div>

          {/* Current Screen Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Tela em Exibição
              </span>
              <span className="text-xs font-mono text-slate-400">390 × 844 px</span>
            </div>
            <h2 className="text-lg font-black text-white">{screenNames[currentScreen]}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentScreen === 'home' &&
                'Tela principal com saudação personalizada, geolocalização no cabeçalho, busca em tempo real, chips de categorias e card hero "VAGOU AGORA ⚡".'}
              {currentScreen === 'mapa' &&
                'Visualização em mapa vetorial interativo com pins de preços (R$ 45) e tesoura, acompanhados de bottom sheet flutuante com CTA "VER OFERTA".'}
              {currentScreen === 'lista-ofertas' &&
                'Listagem comparativa de profissionais disponíveis hoje, com filtros rápidos por Preço, Distância e Avaliação.'}
              {currentScreen === 'detalhe-oferta' &&
                'Página de decisão do cliente com galeria, grid 3 colunas de confirmação de horário (DIA, HORÁRIO, DURAÇÃO) e botão de reserva com proteção.'}
              {currentScreen === 'confirmacao' &&
                'Comprovante instantâneo com código de protocolo exclusivo, resumo de valores para pagamento no local e aviso de envio no WhatsApp.'}
              {currentScreen === 'agenda' &&
                'Minha Agenda com abas "Próximos" e "Histórico", agrupamento por datas e status dinâmico "EM ANDAMENTO" e "AGENDADO".'}
              {currentScreen === 'perfil' &&
                'Painel do usuário com endereço de Itaquera, formas de pagamento e programa de indicação.'}
            </p>
          </div>

          {/* User Flow Simulator Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fluxo Completo de Reserva
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedOffer(offers[0]);
                  setCurrentScreen('home');
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-200">1. Iniciar na Home ➔ Escolher Oferta</span>
                <span className="text-emerald-400 font-bold">Iniciar ➔</span>
              </button>

              <button
                onClick={() => {
                  setSelectedOffer(offers[0]);
                  setCurrentScreen('detalhe-oferta');
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-200">2. Ver Detalhes do Corte (R$ 45)</span>
                <span className="text-emerald-400 font-bold">Ver ➔</span>
              </button>

              <button
                onClick={() => handleConfirmBooking(offers[0])}
                className="w-full text-left p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 hover:bg-emerald-900/40 transition flex items-center justify-between text-xs"
              >
                <span className="font-bold text-emerald-300">3. Confirmar Reserva com Sucesso</span>
                <span className="text-emerald-400 font-bold">Reservar ⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Code Direct Test */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Testar no seu Celular</span>
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Aponte a câmera do seu smartphone para o QR Code abaixo para abrir o <strong>Vagou</strong> diretamente no seu navegador mobile.
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <img
                src={qrCodeUrl}
                alt="QR Code do App Vagou"
                className="w-48 h-48 mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Direto'}</span>
              </button>

              <button
                onClick={() => {
                  setShowQRModal(false);
                  setIsMobileMode(true);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Ver como fica no navegador (Tela Cheia)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

