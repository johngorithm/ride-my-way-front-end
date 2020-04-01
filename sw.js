
const version = 'v1';
self.addEventListener('install', () => {
    console.log('Service Worker is installed');
})

self.addEventListener('activate', () => {
    console.log('Service Worker is activated');
})

self.addEventListener('fetch', (event) => {
    //event.respondWith(fetch(event.request));

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (event.request.method != 'GET') {
                return fetch(event.request).then((response => {
                    return response;
                }))
            }

            if (response) {
                return response;
            }

            if (!navigator.onLine) {
                return new Response('<h1 style="text-align: center; heigh: 200px; margin: auto; color: red;"> You are offline </h1>', { headers : {'content-Type': 'text/html' }});
            }

            return fetchAndUpdate(event.request);
        })
    )
});


const fetchAndUpdate = (request) => {
    fetch(request)
    .then(res => {
        if (res) {
            return caches.open(version)
                .then((cache) => {
                    return cache.put(request, res.clone())
                }).then(() => {
                    return res;
                })
        }
    })
}