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

// Check if user is actively interacting with the page
const isUserActive = (): boolean => {
  // Check if any input, textarea, or select is focused
  const activeElement = document.activeElement;
  if (activeElement) {
    const tagName = activeElement.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) {
      return true;
    }
  }
  
  // Check if any modal is open (common modal patterns)
  // Check for fixed positioned overlays that are visible
  const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"], [class*="z-50"]');
  for (const modal of modals) {
    const style = window.getComputedStyle(modal);
    // Check if modal is visible (not display:none or visibility:hidden)
    if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
      // Check if it's positioned as an overlay (fixed or absolute with high z-index)
      const position = style.position;
      const zIndex = parseInt(style.zIndex, 10);
      if ((position === 'fixed' || position === 'absolute') && zIndex >= 40) {
        return true;
      }
    }
  }
  
  // Also check for any form that's currently being interacted with
  // by checking if there's a focused element within a form
  if (activeElement) {
    const form = activeElement.closest('form');
    if (form) {
      return true;
    }
  }
  
  return false;
};

// Track when page was loaded
let pageLoadTime = Date.now();

// Check if it's safe to reload (user is idle)
const isSafeToReload = (): boolean => {
  // Don't reload if user is actively interacting
  if (isUserActive()) {
    return false;
  }
  
  // Don't reload if page was just loaded (within last 30 seconds)
  const timeSinceLoad = Date.now() - pageLoadTime;
  if (timeSinceLoad < 30000) {
    return false;
  }
  
  return true;
};

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Track page load time
    pageLoadTime = Date.now();
    
    let updateCheckInterval: NodeJS.Timeout | null = null;
    let lastVisibilityCheck = 0;
    let pendingUpdate = false;
    let messageHandler: ((event: MessageEvent) => void) | null = null;
    let visibilityHandler: (() => void) | null = null;
    let registration: ServiceWorkerRegistration | null = null;
    
    if ('serviceWorker' in navigator) {
      const handleLoad = () => {
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
          .then((reg) => {
            registration = reg;
            console.log('SW registered: ', registration);
            
            // Function to handle safe reload
            const attemptSafeReload = () => {
              if (isSafeToReload()) {
                console.log('Reloading to apply service worker update');
                window.location.reload();
              } else {
                // Wait a bit and try again, but only if update is still pending
                if (pendingUpdate) {
                  setTimeout(() => {
                    if (isSafeToReload()) {
                      window.location.reload();
                    }
                  }, 10000); // Wait 10 seconds before trying again
                }
              }
            };
            
            // Listen for service worker updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker is available
                    console.log('New service worker available');
                    pendingUpdate = true;
                    // Don't auto-reload - wait for safe moment
                    attemptSafeReload();
                  }
                });
              }
            });

            // Listen for messages from service worker
            messageHandler = (event: MessageEvent) => {
              if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('Service worker updated to version:', event.data.version);
                pendingUpdate = true;
                // Don't auto-reload - wait for safe moment
                attemptSafeReload();
              }
            };
            navigator.serviceWorker.addEventListener('message', messageHandler);

            // Check for updates less frequently (every 30 minutes instead of 5)
            // This reduces unnecessary checks and potential reloads
            updateCheckInterval = setInterval(() => {
              // Only check for updates if user is not actively interacting
              if (!isUserActive()) {
                reg.update();
              }
            }, 30 * 60 * 1000); // 30 minutes

            // Check for updates when page becomes visible, but throttle it
            visibilityHandler = () => {
              if (!document.hidden) {
                const now = Date.now();
                // Only check if it's been at least 5 minutes since last check
                if (now - lastVisibilityCheck > 5 * 60 * 1000) {
                  lastVisibilityCheck = now;
                  // Only check if user is not actively interacting
                  if (!isUserActive()) {
                    reg.update();
                  }
                }
              }
            };
            document.addEventListener('visibilitychange', visibilityHandler);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      };
      
      window.addEventListener('load', handleLoad);
      
      // Cleanup function
      return () => {
        window.removeEventListener('load', handleLoad);
        if (updateCheckInterval) {
          clearInterval(updateCheckInterval);
        }
        if (messageHandler) {
          navigator.serviceWorker.removeEventListener('message', messageHandler);
        }
        if (visibilityHandler) {
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      };
    }
  }, []);

  return null;
}

