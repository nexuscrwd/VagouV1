// Service Worker for Vagou PWA - Network First & Auto Cache Invalidation
const CACHE_NAME = 'vagou-cache-v6';

self.addEventListener('install', (event) => {
  // Ativa imediatamente a nova versão
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Deleta caches legados antigos para desobstruir CSS/JS quebrados
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache legado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy: Sempre busca da rede primeiro para garantir CSS e JS atualizados
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Não intercepta chamadas do servidor de desenvolvimento Vite nem websockets
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.includes('node_modules') ||
    url.pathname.includes('hot-update') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Requisições de navegação (HTML): sempre busca na rede
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Assets estáticos (CSS, JS, imagens, fontes): Network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
