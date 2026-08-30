export type ScreenId =
  | 'home'
  | 'mapa'
  | 'lista-ofertas'
  | 'detalhe-oferta'
  | 'confirmacao'
  | 'agenda'
  | 'perfil';

export type PartnerScreenId =
  | 'partner-agenda'
  | 'partner-publish'
  | 'partner-schedule-config'
  | 'partner-profile';

export type AppMode = 'client' | 'partner';

export interface TimeBreak {
  id: string;
  label: string;
  start: string; // e.g. "12:00"
  end: string;   // e.g. "13:00"
}

export interface DayScheduleConfig {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda ... 6 = Sábado
  dayName: string;
  active: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  breaks: TimeBreak[];
}

export interface PartnerProfessional {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  specialties: string[];
  color: string;
  slotDurationMinutes: number;
  useCustomSchedule: boolean;
  schedule: DayScheduleConfig[];
}

export interface PartnerAppointmentItem {
  id: string;
  protocolCode: string;
  professionalId: string;
  professionalName: string;
  clientName: string;
  clientPhone: string;
  serviceTitle: string;
  serviceCategory: 'cabelo' | 'barba' | 'unhas' | 'beleza' | 'estetica';
  price: number;
  dateStr: string; // "2026-08-29"
  startTime: string; // "14:30"
  endTime: string;   // "15:15"
  status: 'CONFIRMADO' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'NO_SHOW' | 'VAGA_PUBLICADA' | 'HORARIO_LIVRE';
  notes?: string;
}

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
