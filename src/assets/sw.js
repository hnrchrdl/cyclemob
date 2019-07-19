const version = "0.6.16";
const cacheName = `airhorner-${version}`;
self.addEventListener('install', e => {
    console.log('install', e)
    // e.waitUntil(
    //     caches.open(cacheName).then(cache => {
    //         return cache.addAll([
    //             `/`,
    //             `/index.html`,
    //             `/main.bundle.js`,
    //             `/vendor.bundle.js`,
    //             `/styles.bundle.js`,
    //             `/polyfills.bundle.js`,
    //             `/inline.bundle.js`
    //         ])
    //             .then(() => self.skipWaiting());
    //     })
    //     );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});


var tileDomain = 'tile.thunderforest.com';

// function unableToResolve() {
//    return new Response('', {status: 503, statusText: 'service unavailable'});
// }

self.addEventListener('fetch', event => {
    console.log('fetch', event)
    // event.respondWith(
    //     caches.open(cacheName)
    //         .then(cache => cache.match(event.request, {ignoreSearch: true}))
    //         .then(response => {
    //     return response || fetch(event.request);
    //     })
    // );

    // map tile cache
    // http://www.ravenrend.com/rJlN2DZ_/
//   var request = event.request;
//    // if the cached response does not exist perform a fetch for that resource
//    // and return the response, otherwise return response from cache
//    var queriedCache = function(cached) {
//       var response = cached || fetch(request)
//          .then(fetchedFromNetwork, unableToResolve)
//          .catch(unableToResolve);

//       return response;
//    };

//    var fetchedFromNetwork = function(response) {
//       // cache response if request was successful
//       if (response.status === 200) {
//          caches.open(tileDomain).then(function(cache) {
//             // store response in cache keyed by original request
//             cache.put(event.request, response);
//          });
//       }
//       // cache.put consumes response body
//       return response.clone();
//    };

//    // only cache requests from tile server
//    if (request.url.indexOf(tileDomain) === -1) {
//       event.respondWith(fetch(request));
//    } else {
//       event.respondWith(caches.match(request).then(queriedCache));
//    }
});



// cache nearby tiles
// var tileSrc = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3';
// var zoomRangeCache = [10, 11, 12, 13, 14, 15];
// var defaultZoom = 12;
// var defaultCenter = [-98.5795, 39.828175];
// var cacheRadius = 10000;
// var tilesCached = false;
// var tileLayer = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=61444b383bbc468dbd554f7257efd5f3')

// // make requests for tiles given a set of coordinates and zoom ranges
// // these requests will trigger the service worker to cache responses
// function requestTiles(src, imageCoordinates, zoomRange) {
//    zoomRange.forEach(function(zoom) {
//       imageCoordinates.forEach(function(coordinate) {
//          var request = new XMLHttpRequest();
//          var tileSrc = src;
//          tileSrc = tileSrc.replace('{z}', zoom);
//          tileSrc = tileSrc.replace('{x}', coordinate[0]);
//          tileSrc = tileSrc.replace('{y}', coordinate[1]);

//          request.open('GET', tileSrc);
//          request.send();
//       });
//    });
// }