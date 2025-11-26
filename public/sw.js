// Service Worker for DEN BMX PWA
// Cache name will be set dynamically based on version file
let CACHE_NAME = 'den-bmx-v1';
let CURRENT_VERSION = null;

// Check if we're in development mode
const isDevelopment = () => {
  const hostname = self.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local')
  );
};

// Fetch current version from version.json
async function getCurrentVersion() {
  try {
    const response = await fetch('/version.json?t=' + Date.now());
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.log('Failed to fetch version:', error);
    // Fallback to timestamp-based version
    return Date.now().toString();
  }
}

// Initialize version and cache name
async function initializeVersion() {
  CURRENT_VERSION = await getCurrentVersion();
  CACHE_NAME = `den-bmx-${CURRENT_VERSION}`;
  return CACHE_NAME;
}

const urlsToCache = [
  '/',
  '/tracks',
  '/contact',
  '/new-rider',
  '/logos/DEN_BMX_FINAL_Green.png',
  '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  // In development, skip caching entirely
  if (isDevelopment()) {
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    initializeVersion().then((cacheName) => {
      return caches.open(cacheName)
        .then((cache) => {
          return cache.addAll(urlsToCache);
        })
        .catch((err) => {
          console.log('Cache install failed:', err);
        });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and check for updates
self.addEventListener('activate', (event) => {
  // In development, clear all caches and don't activate
  if (isDevelopment()) {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Deleting cache in development:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        return self.clients.claim();
      })
    );
    return;
  }
  
  event.waitUntil(
    initializeVersion().then((cacheName) => {
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheNameToCheck) => {
            if (cacheNameToCheck !== cacheName) {
              console.log('Deleting old cache:', cacheNameToCheck);
              return caches.delete(cacheNameToCheck);
            }
          })
        );
      }).then(() => {
        // Notify all clients that a new version is available
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: CURRENT_VERSION
            });
          });
        });
      });
    })
  );
  return self.clients.claim();
});

// Fetch event - network-first strategy for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // In development, bypass all caching - always fetch from network
  if (isDevelopment()) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Don't cache API requests or non-GET requests
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For HTML pages, use network-first strategy to ensure fresh content
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            initializeVersion().then((cacheName) => {
              caches.open(cacheName).then((cache) => {
                cache.put(request, responseToCache);
              });
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline', { status: 503 });
          });
        })
    );
  } else {
    // For static assets (images, CSS, JS), use stale-while-revalidate strategy
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            initializeVersion().then((cacheName) => {
              caches.open(cacheName).then((cache) => {
                cache.put(request, responseToCache);
              });
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, return cached if available
          return cachedResponse;
        });

        // Return cached version immediately if available, then update in background
        return cachedResponse || fetchPromise;
      })
    );
  }
});

