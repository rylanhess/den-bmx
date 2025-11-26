'use client';

import { useEffect } from 'react';

// Check if we're in development mode (runtime check based on hostname)
const isDevelopment = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local')
  );
};

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // In development, unregister any existing service workers and don't register new ones
        if (isDevelopment()) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
              registration.unregister().then((success) => {
                if (success) {
                  console.log('Service worker unregistered for development');
                }
              });
            }
          });
          // Clear all caches in development
          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                caches.delete(cacheName);
              });
            });
          }
          return;
        }

        // Production: Register service worker
        navigator.serviceWorker
          .register('/sw.js?v=' + Date.now())
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Listen for service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker is available, prompt user to reload
                    console.log('New service worker available');
                    // Force reload after a short delay to allow the new SW to activate
                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  }
                });
              }
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('Service worker updated to version:', event.data.version);
                // Force reload to get the latest version
                window.location.reload();
              }
            });

            // Check for updates more frequently (every 5 minutes)
            setInterval(() => {
              registration.update();
            }, 5 * 60 * 1000);

            // Also check for updates when page becomes visible
            document.addEventListener('visibilitychange', () => {
              if (!document.hidden) {
                registration.update();
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
}

