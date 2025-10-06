// sw.js - Service Worker for Maa Anpurna Aahar PWA
'use strict';

const CACHE_NAME = 'maa-anpurna-aahar-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const DYNAMIC_CACHE = 'dynamic-v1.2.0';

// Files to cache immediately
const CACHE_URLS = [
  '/',
  '/index.html',
  '/products.html',
  '/cart.html',
  '/contact.html',
  '/profile.html',
  '/login.html',
  '/register.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/js/translations.js',
  '/firebase-config.js',
  '/auth.js',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting(); // Force activation
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external URLs (except for fonts and CDN resources)
  if (url.origin !== location.origin && 
      !url.hostname.includes('googleapis.com') && 
      !url.hostname.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    cacheFirstStrategy(request)
  );
});

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Update cache in background if it's a navigation request
      if (request.mode === 'navigate') {
        updateCacheInBackground(request);
      }
      return cachedResponse;
    }
    
    // Fallback to network
    return await fetchAndCache(request);
    
  } catch (error) {
    console.error('Cache strategy failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your internet connection');
    }
    
    // Return generic offline response for other requests
    return new Response('Offline', { status: 503 });
  }
}

// Fetch from network and cache the response
async function fetchAndCache(request) {
  const response = await fetch(request);
  
  // Only cache successful responses
  if (response.status === 200) {
    const responseClone = response.clone();
    const cacheName = getCacheNameForRequest(request);
    
    caches.open(cacheName).then((cache) => {
      cache.put(request, responseClone);
    });
  }
  
  return response;
}

// Update cache in background
function updateCacheInBackground(request) {
  fetch(request).then((response) => {
    if (response.status === 200) {
      const responseClone = response.clone();
      const cacheName = getCacheNameForRequest(request);
      
      caches.open(cacheName).then((cache) => {
        cache.put(request, responseClone);
      });
    }
  }).catch((error) => {
    console.log('Background update failed:', error);
  });
}

// Determine which cache to use for different types of requests
function getCacheNameForRequest(request) {
  const url = new URL(request.url);
  
  // Static assets (CSS, JS, images)
  if (url.pathname.includes('/assets/') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg')) {
    return STATIC_CACHE;
  }
  
  // Dynamic content
  return DYNAMIC_CACHE;
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-cart') {
    event.waitUntil(syncOfflineActions());
  }
});

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  try {
    // Get offline actions from IndexedDB or localStorage
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, action.options);
        await removeOfflineAction(action.id);
        console.log('Synced offline action:', action.type);
      } catch (error) {
        console.error('Failed to sync action:', action.type, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline actions (implement based on your storage mechanism)
function getOfflineActions() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return Promise.resolve([]);
}

// Remove synced offline action
function removeOfflineAction(actionId) {
  // This would typically remove from IndexedDB
  return Promise.resolve();
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  const options = {
    body: 'New products available at Maa Anpurna Aahar!',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    tag: 'product-update',
    data: {
      url: '/products.html',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view-products',
        title: 'View Products',
        icon: '/assets/images/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/images/dismiss-icon.png'
      }
    ],
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  if (event.data) {
    const payload = event.data.json();
    options.body = payload.message || options.body;
    options.data.url = payload.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification('Maa Anpurna Aahar', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();
  
  let targetUrl = '/';
  
  if (event.action === 'view-products') {
    targetUrl = '/products.html';
  } else if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('ServiceWorker received message:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
        
      default:
        console.log('Unknown message type:', event.data.type);
    }
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('All caches cleared');
}

// Periodic background sync (experimental)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

// Update content in background
async function updateContent() {
  try {
    // Fetch latest products or content
    const response = await fetch('/api/products/latest');
    const data = await response.json();
    
    // Cache the updated content
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put('/api/products/latest', new Response(JSON.stringify(data)));
    
    console.log('Content updated in background');
  } catch (error) {
    console.error('Background content update failed:', error);
  }
}

console.log('ServiceWorker script loaded successfully');