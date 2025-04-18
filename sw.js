// sw.js - Service Worker para cache offline
const CACHE_NAME = 'chat-ao';
const urlsToCache = [
    '/',
    '/chatao.html',
    '/styles.css',
    '/script.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'botão.mp3',
    'noti.mp3',
    'message.mp3'
];

// Instalar o Service Worker e cache inicial
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar solicitações e servir a partir do cache quando possível
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone a requisição
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    response => {
                        // Verificar se recebemos uma resposta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone a resposta
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Não cache respostas da API do Firebase
                                if (!event.request.url.includes('firebaseio.com') && 
                                    !event.request.url.includes('firestore') &&
                                    !event.request.url.includes('googleapis')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                            
                        return response;
                    }
                );
            })
    );
});

// Limpar caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
