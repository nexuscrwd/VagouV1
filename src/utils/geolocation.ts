/**
 * Utilitários de Geolocalização e Cálculo de Proximidade (Haversine)
 */

import { ServiceOffer } from '../types';

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Coordenadas padrão de fallback (São Paulo / Região Central/Leste onde os salões do mock estão localizados)
export const DEFAULT_USER_COORDS: UserCoordinates = {
  lat: -23.535,
  lng: -46.452,
};

let cachedCoordinates: UserCoordinates | null = null;

/**
 * Fórmula de Haversine para cálculo de distância em metros entre duas coordenadas geográficas
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formata distância em metros para exibição amigável (ex: '450 m' ou '2.1 km')
 */
export function formatDistanceString(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

/**
 * Obtém a localização atual do usuário via Geolocation API com cache em memória e sessionStorage
 */
export async function getDeviceCoordinates(): Promise<UserCoordinates | null> {
  // 1. Verificar cache em memória
  if (cachedCoordinates) {
    return cachedCoordinates;
  }

  // 2. Verificar cache em sessionStorage
  try {
    const saved = sessionStorage.getItem('vagou_user_coords');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        cachedCoordinates = parsed;
        return parsed;
      }
    }
  } catch {}

  // 3. Consultar Geolocation API
  if (typeof window === 'undefined' || !navigator.geolocation) {
    console.warn('Geolocation API não suportada neste ambiente.');
    return DEFAULT_USER_COORDS;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        cachedCoordinates = coords;
        try {
          sessionStorage.setItem('vagou_user_coords', JSON.stringify(coords));
        } catch {}
        resolve(coords);
      },
      (error) => {
        console.warn('Erro ao obter geolocalização do dispositivo:', error.message);
        // Em caso de negação ou erro, utiliza coordenadas de referência padrão
        resolve(DEFAULT_USER_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Ordena lista de ofertas por proximidade do usuário
 */
export function sortOffersByDistance(
  offers: ServiceOffer[],
  coords: UserCoordinates | null
): ServiceOffer[] {
  const userLat = coords?.lat ?? DEFAULT_USER_COORDS.lat;
  const userLng = coords?.lng ?? DEFAULT_USER_COORDS.lng;

  const withCalculatedDistances = offers.map((offer) => {
    // Se a oferta tiver lat/lng válidos, calcula a distância real
    if (typeof offer.lat === 'number' && typeof offer.lng === 'number') {
      const meters = calculateDistanceMeters(userLat, userLng, offer.lat, offer.lng);
      return {
        ...offer,
        distanceMeters: meters,
        distance: formatDistanceString(meters),
      };
    }
    return offer;
  });

  return [...withCalculatedDistances].sort((a, b) => {
    const distA = a.distanceMeters ?? (parseFloat(a.distance) * 1000 || 99999);
    const distB = b.distanceMeters ?? (parseFloat(b.distance) * 1000 || 99999);
    return distA - distB;
  });
}
