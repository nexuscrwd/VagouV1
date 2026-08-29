export type ScreenId =
  | 'home'
  | 'mapa'
  | 'lista-ofertas'
  | 'detalhe-oferta'
  | 'confirmacao'
  | 'agenda'
  | 'perfil';

export interface ServiceOffer {
  id: string;
  salonName: string;
  professionalName: string;
  serviceTitle: string;
  serviceCategory: 'cabelo' | 'barba' | 'unhas' | 'beleza' | 'estetica';
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  distance: string;
  neighborhood: string;
  timeSlot: string;
  dayLabel: string;
  duration: string;
  imageUrl: string;
  lat: number;
  lng: number;
  featured?: boolean;
}

export interface BookingAppointment {
  protocolCode: string;
  service: string;
  professional: string;
  salonName: string;
  dateTime: string;
  dayGroup: 'HOJE, 26 DE JAN' | 'AMANHÃ, 27 DE JAN' | 'HISTÓRICO';
  time: string;
  totalPrice: number;
  status: 'EM ANDAMENTO' | 'AGENDADO' | 'CONCLUÍDO' | 'CANCELADO';
  address: string;
  qrCodeMock?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  size?: string;
  modifiedTime?: string;
  category: 'image' | 'video' | 'figma' | 'folder' | 'document' | 'other';
  hasThumbnail?: boolean;
}

export interface DriveFolderBreadcrumb {
  id: string;
  name: string;
}

export interface ScreenAnalysis {
  screenName: string;
  primaryPurpose: string;
  hierarchy: string[];
  designTokens: {
    colors: { name: string; hex: string; usage: string }[];
    typography: { role: string; size: string; weight: string }[];
    spacing: string[];
  };
  components: {
    name: string;
    description: string;
    suggestedTailwind: string;
  }[];
  userFlowStep: string;
  recommendations: string[];
}
