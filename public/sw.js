// NutriConnect Service Worker - PWA Offline Support
const CACHE_NAME = 'nutriconnect-v1.0.0';
const STATIC_CACHE_NAME = 'nutriconnect-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'nutriconnect-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/auth/register',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  // Add more critical assets as needed
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/auth\/verify/,
  /\/api\/users\/profile/,
  /\/api\/health/,
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\/auth\/(login|register|logout)/,
  /\/api\/appointments/,
  /\/api\/progress/,
];

// Cache-first patterns (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
  /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
  /\/icons\//,
  /\/screenshots\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - handle requests with different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request, url));
  } else {
    // For non-GET requests (POST, PUT, DELETE), always go to network
    event.respondWith(
      fetch(request).catch(() => {
        // If network fails, return a custom offline response for API calls
        if (url.pathname.startsWith('/api/')) {
          return new Response(
            JSON.stringify({
              error: 'Offline',
              message: 'This action requires an internet connection'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        throw error;
      })
    );
  }
});

// Handle GET requests with appropriate caching strategy
async function handleGetRequest(request, url) {
  // Network-first strategy for critical API calls
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return networkFirst(request);
  }
  
  // Cache-first strategy for static assets
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return cacheFirst(request);
  }
  
  // API caching for specific endpoints
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return networkFirst(request, DYNAMIC_CACHE_NAME);
  }
  
  // Default: Stale-while-revalidate for HTML pages
  return staleWhileRevalidate(request);
}

// Network-first strategy
async function networkFirst(request, cacheName = DYNAMIC_CACHE_NAME) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || createOfflineResponse();
    }
    
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache-first failed:', request.url, error);
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch((error) => {
      console.log('[SW] Fetch failed in stale-while-revalidate:', error);
      return cachedResponse;
    });
  
  return cachedResponse || fetchPromise;
}

// Create offline response
function createOfflineResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NutriConnect - Offline</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 40px;
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .offline-container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                max-width: 400px;
            }
            .offline-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            h1 {
                margin: 20px 0;
                font-size: 24px;
            }
            p {
                margin: 15px 0;
                font-size: 16px;
                line-height: 1.5;
            }
            .retry-btn {
                background: white;
                color: #4CAF50;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            .retry-btn:hover {
                transform: scale(1.05);
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">🥗</div>
            <h1>NutriConnect</h1>
            <p>You're currently offline, but don't worry! Some features are still available.</p>
            <p>Check your internet connection and try again.</p>
            <button class="retry-btn" onclick="window.location.reload()">
                Try Again
            </button>
        </div>
    </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

// Handle background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  
  // Here you can implement logic to sync offline data
  // when the connection is restored
  try {
    // Example: sync pending appointments, progress entries, etc.
    await syncPendingData();
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync pending data (placeholder implementation)
async function syncPendingData() {
  // This would typically sync any data stored locally
  // while the user was offline
  console.log('[SW] Syncing pending data...');
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from NutriConnect',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-72x72.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('NutriConnect', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'nutriconnect-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle cache storage quota exceeded
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
});

console.log('[SW] NutriConnect service worker loaded successfully! 🥗');